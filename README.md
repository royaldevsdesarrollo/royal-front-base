# Royal Stack Web

Plantilla base propia para desarrollo frontend: **Vite 7 + React 19 + TypeScript (strict)**
con una arquitectura modular. Inspirada en el template `royal-front`, construida desde cero
y mantenida de forma independiente.

## Documentación

- [`docs/PROJECT.md`](./docs/PROJECT.md): arquitectura, infraestructura, decisiones y estado.
- [`docs/MODULES.md`](./docs/MODULES.md): anatomía, flujo y checklist para módulos.
- [`AGENTS.md`](./AGENTS.md): instrucciones operativas para agentes de IA.

> **Estado del proyecto:** scaffold funcional con Auth, API mock, rutas protegidas, theme,
> showcase de componentes, módulo de ejemplo y pruebas automatizadas.

## Stack

- **Vite 7** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (plugin `@tailwindcss/vite`, CSS-first, sin `tailwind.config`)
- **React Router v6** — rutas públicas/protegidas con lazy loading
- **TanStack Query** (estado de servidor) + **TanStack Table**
- **Zustand** — estado de cliente
- **React Hook Form** + **Zod** (`zodResolver`)
- **Axios** — cliente HTTP con interceptores
- **MSW** — API mock de desarrollo y pruebas
- **Sonner** (toasts) · **nuqs** (estado en URL) · **react-error-boundary**
- Helpers de clases: `cn()` (clsx + tailwind-merge) y `cva` (variantes)

## Requisitos

- Node `22.16.0` (ver `.nvmrc`)
- pnpm (ver `packageManager` en `package.json`)

## Instalación

```bash
pnpm install
```

## Scripts

```bash
pnpm dev          # servidor de desarrollo (http://localhost:4200)
pnpm build        # tsc -b + build de producción -> dist/
pnpm preview      # sirve el build de producción
pnpm typecheck    # verifica los proyectos TypeScript referenciados
pnpm lint         # verifica código, React, accesibilidad y estilo
pnpm lint:fix     # corrige automáticamente estilo e infracciones reparables
pnpm test         # ejecuta las pruebas una vez
pnpm test:watch   # ejecuta las pruebas en modo interactivo
pnpm ui:add       # agrega componentes UI con shadcn + regenera el barrel
pnpm ui:barrel    # regenera el barrel de shared/components/ui
```

Con los valores predeterminados el servidor de desarrollo usa la API mock. Credenciales:
`demo@royalstack.dev` / `demo1234`.

## Variables de entorno

Copia `.env.example` a `.env`:

| Variable                     | Descripción                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| `VITE_API_URL`               | URL base de la API. Por defecto `/api`.                            |
| `VITE_API_TIMEOUT_MS`        | Timeout HTTP en milisegundos. Por defecto `15000`.                 |
| `VITE_API_PROXY_TARGET`      | Destino del proxy `/api` en desarrollo.                            |
| `VITE_API_MOCK_ENABLED`      | Activa MSW únicamente en desarrollo. Por defecto `true`.           |
| `VITE_SENTRY_ENABLED`        | Activa Sentry en runtime. Por defecto `false`.                     |
| `VITE_SENTRY_DSN`            | DSN público; obligatorio solo cuando Sentry está habilitado.       |
| `VITE_SENTRY_ENVIRONMENT`    | Entorno reportado a Sentry.                                       |
| `VITE_SENTRY_RELEASE`        | Release común entre runtime y source maps.                         |
| `SENTRY_AUTH_TOKEN`          | Secreto de CI para subir source maps; nunca usa prefijo `VITE_`.   |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Organización y proyecto usados durante el build.               |

Las variables runtime se validan con Zod al cargar la aplicación. Si Sentry está
deshabilitado, el DSN y las credenciales de CI no son necesarios.

## Estructura

```text
src/
├── routes/                # Definición de rutas (createBrowserRouter)
├── pages/                 # Páginas por dominio — componen; sin lógica de negocio
├── modules/               # Módulos de negocio
└── shared/                # Infraestructura transversal
    ├── assets/
    │   ├── images/        # Recursos gráficos compartidos
    │   └── styles/        # Estilos globales (index.css; tokens en theme.css)
    ├── components/
    │   ├── ui/            # Kit de componentes base (Button, Input, Dialog, ...)
    │   ├── datatable/     # Tablas/listados de datos y paginación
    │   ├── layouts/       # AppSidebar, MainLayout y PageContainer
    │   ├── feedback/      # AppErrorBoundary y FullPageLoader
    │   ├── routes/        # Primitivas de rutas compartidas futuras
    │   └── common/        # Compartidos que no encajan en otra categoría
    ├── config/            # env, constantes (ROUTES, API_ENDPOINTS, QUERY_KEYS)
    ├── hooks/             # Hooks reutilizables (useDebounce, useDataTable, ...)
    ├── lib/
    │   ├── api/           # apiClient, publicApiClient, queryClient y errores
    │   └── monitoring/    # Fachada no-op + adaptador opcional de Sentry
    ├── stores/            # Zustand (useAppStore, useAuthStore, ...)
    ├── types/             # Tipos compartidos (API, comunes, layout, ...)
    └── utils/             # cn(), formateadores, helpers puros
```

**Flujo de datos:** `components → hooks → services → apiClient`.

## Infraestructura compartida

### HTTP y sesión

- `publicApiClient`: endpoints públicos; no adjunta credenciales.
- `apiClient`: adjunta el JWT como Bearer desde `useAuthStore`.
- El JWT se persiste en `localStorage` mediante Zustand y se valida antes de cada petición.
- No existe refresh token. Un JWT vencido o un `401` autenticado limpia sesión, cache de
  TanStack Query y usuario de monitoreo, y muestra un aviso deduplicado.
- `401` en `publicApiClient` se conserva como error normal (por ejemplo, credenciales inválidas).
- Axios no define `Content-Type` global para permitir JSON y `FormData` correctamente.

### TanStack Query

- Queries: `staleTime` de 1 minuto y `gcTime` de 10 minutos.
- Red/`5xx`: máximo dos reintentos; `4xx`, cancelaciones y sesión expirada no reintentan.
- Mutations: toast global normalizado y sin reintentos.
- Opt-out por mutation: `meta.skipGlobalErrorToast`.
- Opt-out de monitoreo: `meta.skipErrorReporting`.
- Mensaje personalizado: `meta.errorMessage`.

### Zustand

- `useAppStore`: tema (`light`, `dark`, `system`) y estado del sidebar; persiste ambos.
- `useAuthStore`: persiste únicamente el JWT. El usuario autenticado se consulta con
  TanStack Query (`/auth/me`) para no duplicar estado de servidor.
- `isAuthenticated` es un selector derivado, no un valor persistido.

### Monitoreo opcional

La aplicación consume una fachada neutral (`reportError`, `reportMessage`,
`setMonitoringUser`, `clearMonitoringUser`). Sin configuración funciona como no-op.

Cuando `VITE_SENTRY_ENABLED=true`, el adaptador de Sentry se carga dinámicamente mediante
`setupMonitoring()`. No envía PII por defecto y elimina headers/parámetros sensibles.

Los source maps solo se generan y suben cuando el build recibe todas las credenciales de CI.
Se usan como source maps ocultos y se eliminan de `dist` después de subirlos. No están
habilitados Performance Tracing ni Session Replay.

Se reportan errores desconocidos y `5xx`. No se reportan cancelaciones, problemas de red del
usuario ni errores esperados `4xx`.

## Componentes UI (shadcn)

El proyecto está configurado para la CLI de **shadcn** (`components.json`, estilo
`radix-nova`, iconos `lucide`). Los componentes se instalan en
`src/shared/components/ui/` y se consumen por el barrel:

```tsx
import { Badge, Button } from '@/shared/components/ui'
```

**Flujo recomendado** — agrega componentes y actualiza el barrel en un solo paso:

```bash
pnpm ui:add badge button
```

**Flujo alternativo** — si usas la CLI directamente, sincroniza el barrel después:

```bash
pnpm dlx shadcn@latest add badge
pnpm ui:barrel
```

Notas:

- Los archivos generados por la CLI usan **kebab-case** (`badge.tsx`, `dropdown-menu.tsx`)
  y se tratan como código generado: se personalizan, pero no se renombran (componentes
  compuestos se importan entre sí por ese nombre). Los componentes propios, fuera de
  `ui/`, siguen en `PascalCase.tsx`.
- `ui/index.ts` es un **archivo generado** (`pnpm ui:barrel`); no se edita a mano.
- Los componentes importan `cn` desde `@/shared/utils` y las primitivas del paquete
  `radix-ui`, ambos ya instalados.
- Los tokens visuales (`bg-primary`, `text-muted-foreground`, ...) se definen en
  `theme.css` y ofrecen modos claro, oscuro y sistema.
- El Sidebar oficial de shadcn está integrado en `MainLayout`, colapsa a iconos en escritorio
  y utiliza un Sheet en móvil. Su preferencia se recuerda entre recargas.

## Layout principal

- Navegación lateral izquierda con Inicio, Showcase y Ejemplo.
- Colapso mediante trigger, rail, `Cmd+B` o `Ctrl+B`.
- Header compacto con breadcrumb derivado de la navegación y selector de tema.
- Usuario y logout en el footer del Sidebar.
- Contenido a ancho completo, sin `max-w-7xl` ni márgenes laterales de centrado.

## Calidad de código

El proyecto usa **ESLint 9 con Flat Config** como única herramienta para analizar y
formatear el código. No usa Prettier, Airbnb ni SonarJS.

- `@eslint/js`: reglas generales recomendadas.
- `typescript-eslint`: reglas type-aware, promesas, imports de tipos y código inseguro.
- `eslint-plugin-react` + `eslint-plugin-react-hooks`: React 19 y reglas modernas de hooks.
- `eslint-plugin-react-refresh`: compatibilidad con Fast Refresh de Vite.
- `eslint-plugin-jsx-a11y`: accesibilidad en JSX.
- `@stylistic/eslint-plugin`: formato automático con 2 espacios, comillas simples y sin
  punto y coma.

Antes de considerar terminado un cambio:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Ejecuta también `pnpm build` cuando el cambio afecte rutas, exports, dependencias,
configuración o bootstrap.

El comando `pnpm ui:add` ejecuta ESLint autofix sobre los componentes generados por shadcn.

## Convenciones

- **Alias `@/`** → `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).
  Prohibidos los paths relativos profundos (`../../..`).
- **Barrels (`index.ts`)**: cada carpeta expone su API pública con *named exports*;
  los consumidores importan del barrel, no de archivos internos.
- **Idiomas**: documentación, comentarios y JSDoc en **español**; código, nombres de
  archivos y arquitectura de carpetas en **inglés**.
- **Un componente React por archivo** (`PascalCase.tsx`).
- Naming por carpeta: `*.service.ts`, `*.schema.ts`, `*.types.ts`, `use*.ts`,
  `*Page.tsx`, `use*Store.ts`, `*.config.ts`.

## Roadmap por fases

| Fase | Contenido                                                        | Estado      |
| ---- | ---------------------------------------------------------------- | ----------- |
| 1    | Scaffolding: dependencias, configuración de build y arquitectura | ✅ Completada |
| 2    | Bootstrap funcional (`main.tsx`, `App.tsx`, rutas, HomePage)     | Completada  |
| 3    | Infraestructura shared (API, Query, stores, errores, Sentry)     | Completada  |
| 4    | Theme y estilos (`theme.css` con tokens `@theme`, fuentes)       | Completada  |
| 5    | Calidad de código: ESLint 9 + Stylistic, sin Prettier           | Completada  |
| 6    | Configuración de shadcn (CLI + aliases + barrel automático)      | ✅ Completada |
| 7    | Layouts + rutas protegidas                                       | Completada  |
| 8    | Auth mock, showcase y módulo de ejemplo                           | Completada  |
| 9    | Git + hooks (lefthook/commitlint)                                | Pendiente   |
| 10   | Guía de módulos e instrucciones para agentes                     | Completada  |

> El kit UI se construye **bajo demanda**: agrega cada componente con `pnpm ui:add`
> cuando lo necesites. El conjunto esencial actual se puede explorar en `/showcase`.
