# Documentación del proyecto

## Propósito

`royal-stack-web` es una plantilla frontend independiente construida con Vite, React y
TypeScript. Toma como referencia algunas ideas de `royal-front`, pero sus decisiones,
convenciones y evolución se mantienen de forma separada.

Este archivo es la fuente detallada del estado actual del proyecto. Debe actualizarse cada
vez que una fase cambie la arquitectura, las herramientas o las convenciones.

## Estado actual

La plantilla ya dispone de:

- Arquitectura modular base.
- Dependencias principales instaladas.
- Vite, TypeScript y Tailwind CSS v4 configurados.
- shadcn configurado con instalación y barrel automáticos.
- ESLint 9 como herramienta de análisis y formato.
- Variables de entorno validadas con Zod.
- Clientes HTTP público y autenticado.
- Manejo normalizado de errores.
- TanStack Query configurado.
- Stores de aplicación y autenticación con Zustand.
- Integración opcional de Sentry con source maps condicionales.
- Bootstrap React con providers, monitoreo, tema y router.
- Autenticación completa con login, logout, `/auth/me` y rutas protegidas.
- API mock de desarrollo con MSW.
- Home, showcase de componentes y módulo de tareas de referencia.
- Pruebas automatizadas con Vitest y React Testing Library.

## Convención de idiomas

- Documentación, comentarios y JSDoc: español.
- Identificadores, nombres de archivos y nombres de carpetas: inglés.
- Textos visibles para usuarios: español.

## Stack

### Aplicación

- Vite 7.
- React 19.
- TypeScript 5.9 en modo estricto.
- Tailwind CSS v4 con plugin de Vite.
- React Router v6.
- TanStack Query y TanStack Table.
- Zustand.
- Axios.
- React Hook Form y Zod.
- Sonner.
- nuqs.
- shadcn con preset `radix-nova`.
- Radix UI, Lucide y React Icons.
- MSW para API mock en desarrollo y pruebas.

### Calidad

- ESLint 9 con Flat Config.
- `typescript-eslint` con reglas que utilizan información de tipos.
- Plugins de React, Hooks, React Refresh y accesibilidad.
- ESLint Stylistic para formato.
- Sin Airbnb, SonarJS ni Prettier.
- Vitest, React Testing Library y jest-dom.

### Monitoreo

- `@sentry/react` para captura opcional en runtime.
- `@sentry/vite-plugin` para subir source maps opcionalmente durante el build.

## Comandos

```bash
pnpm install       # instala las dependencias
pnpm dev           # servidor de Vite en localhost:4200
pnpm build         # TypeScript + build de Vite
pnpm preview       # sirve dist/ en localhost:4300
pnpm typecheck     # validación de TypeScript
pnpm lint          # validación de ESLint
pnpm lint:fix      # autofix de ESLint
pnpm test          # pruebas automatizadas
pnpm test:watch    # pruebas en modo interactivo
pnpm ui:add        # agrega componentes shadcn y actualiza el barrel
pnpm ui:barrel     # regenera el barrel de componentes UI
```

Antes de considerar terminado un cambio deben pasar:

```bash
pnpm lint
pnpm typecheck
```

## Arquitectura

```text
src/
├── App.tsx                          # Providers globales
├── main.tsx                         # Bootstrap de monitoreo, mocks y React
├── mocks/                           # Handlers de MSW
├── modules/                         # Módulos de negocio
├── pages/                           # Páginas que componen módulos y componentes
├── routes/                          # Definiciones de React Router
├── shared/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── index.css            # Entrada de Tailwind CSS
│   ├── components/
│   │   ├── common/
│   │   ├── datatable/
│   │   ├── feedback/
│   │   ├── layouts/                  # AppSidebar, MainLayout y navegación
│   │   ├── routes/
│   │   └── ui/                      # Componentes generados por shadcn
│   ├── config/                      # Entorno y constantes globales
│   ├── hooks/                       # Hooks realmente transversales
│   ├── lib/
│   │   ├── api/                     # Axios, Query y errores HTTP
│   │   └── monitoring/              # Fachada y adaptador de Sentry
│   ├── stores/                      # Estado cliente global
│   ├── types/                       # Contratos compartidos
│   └── utils/                       # Funciones puras compartidas
└── vite-env.d.ts
```

### Flujo de datos

```text
components → hooks → services → apiClient
```

- Las páginas componen; no contienen lógica de negocio.
- Los hooks coordinan TanStack Query, navegación y estado de interfaz.
- Los services realizan peticiones y adaptan contratos HTTP.
- Los adapters de cada módulo transformarán DTOs en modelos del dominio.
- `shared` no debe depender de `modules`.

### Anatomía prevista de un módulo

```text
modules/<module>/
├── adapters/
├── components/
├── constants/
├── hooks/
├── schemas/
├── services/
├── types/
├── utils/
└── index.ts
```

Solo deben crearse las carpetas que el módulo realmente necesite. `modules/tasks` es la
referencia neutral; autenticación no es el ejemplo canónico para todos los dominios.

## TypeScript

- Alias `@/*` hacia `src/*` en `tsconfig.app.json`.
- El alias también está declarado en el `tsconfig.json` raíz porque la CLI de shadcn no
  siempre resuelve aliases ubicados únicamente en proyectos referenciados.
- `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` y
  `noImplicitOverride` están habilitados.
- Los imports exclusivamente de tipos usan `import type`.

## ESLint

`eslint.config.mjs` utiliza Flat Config y cubre archivos TypeScript, React y scripts Node.

### Estilo

- Sin punto y coma.
- Comillas simples.
- Indentación de dos espacios.
- JSX habilitado.
- El autofix se ejecuta con `pnpm lint:fix`.

### Reglas funcionales principales

- Prohibición de `any` explícito.
- Promesas flotantes y mal utilizadas detectadas mediante reglas type-aware.
- Imports de tipos consistentes.
- Variables no utilizadas como error; `_` permite marcar parámetros intencionalmente no
  usados.
- Hooks de React y reglas modernas del compilador verificadas.
- Accesibilidad JSX.
- `no-debugger`, `eqeqeq`, `curly`, `prefer-const` y ausencia de imports duplicados.

Los archivos generados por shadcn permiten exportar componentes y variantes CVA en el mismo
archivo, por lo que la regla de Fast Refresh tiene una excepción limitada a `components/ui`.

## shadcn

`components.json` utiliza:

- Preset `radix-nova`.
- TypeScript y React sin RSC.
- Iconos Lucide.
- CSS global en `src/shared/assets/styles/index.css`.
- Componentes UI en `src/shared/components/ui`.
- Utilidades en `src/shared/utils`.

### Flujo recomendado

```bash
pnpm ui:add badge button
```

El comando:

1. Ejecuta la CLI local de shadcn.
2. Instala los archivos y dependencias requeridas.
3. Regenera `src/shared/components/ui/index.ts`.
4. Ejecuta ESLint autofix sobre la carpeta UI.

También se puede usar la CLI directamente:

```bash
pnpm dlx shadcn@latest add dialog
pnpm ui:barrel
```

### Convenciones UI

- Los archivos generados permanecen en kebab-case para no romper imports internos.
- `ui/index.ts` es generado y no debe editarse manualmente.
- El barrel utiliza `export *` para incluir componentes, variantes y tipos.
- El kit esencial incluye formularios, navegación, overlays, feedback y visualización de
  datos. `/showcase` mantiene ejemplos funcionales de sus principales estados.
- `sidebar.tsx` conserva la composición oficial de shadcn y `AppSidebar` aporta la navegación
  concreta del scaffold.
- Los componentes propios fuera de `ui` usarán `PascalCase.tsx`.

### Sidebar y layout

- El sidebar utiliza `variant="sidebar"` y `collapsible="icon"`.
- En escritorio puede alternarse con el trigger, el rail, `Cmd+B` o `Ctrl+B`.
- En móvil se presenta mediante un Sheet y se cierra al navegar.
- La preferencia expandida o colapsada se persiste en `useAppStore`.
- `navigation.config.ts` centraliza rutas, etiquetas, iconos y breadcrumbs.
- `MainLayout` ocupa todo el viewport y el contenido usa `SidebarInset`.
- `PageContainer` no aplica `max-width` ni centrado global; cada pantalla limita únicamente
  los bloques que necesitan una longitud de lectura menor.

## Variables de entorno

```env
VITE_API_URL=/api
VITE_API_TIMEOUT_MS=15000
VITE_API_PROXY_TARGET=http://localhost:3000
VITE_API_MOCK_ENABLED=true

VITE_SENTRY_ENABLED=false
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_RELEASE=local

SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

### Reglas

- Las variables runtime son validadas con Zod en `env.schema.ts`.
- `VITE_API_URL` usa `/api` como valor predeterminado.
- El timeout HTTP predeterminado es de 15 segundos.
- Los mocks están habilitados por defecto únicamente en desarrollo y nunca en producción.
- El DSN es obligatorio solo si Sentry está habilitado.
- `SENTRY_AUTH_TOKEN` no lleva prefijo `VITE_` porque es un secreto exclusivo del build.
- Vite usa `loadEnv` para que el proxy lea correctamente el archivo `.env`.
- Los archivos `.env` no deben versionarse; `.env.example` sí.

## Infraestructura HTTP

### `publicApiClient`

Cliente destinado a login, registro y endpoints que no requieren una sesión existente.

- No adjunta JWT.
- Normaliza errores.
- Un `401` representa un error normal, por ejemplo credenciales inválidas.

### `apiClient`

Cliente destinado a endpoints autenticados.

- Obtiene el JWT desde `useAuthStore`.
- Comprueba el claim `exp` antes de enviar la petición.
- Adjunta `Authorization: Bearer <token>`.
- No configura `Content-Type` globalmente, permitiendo JSON y `FormData`.
- Usa URL y timeout desde `envConfig`.

No existe refresh token. Si el JWT está vencido o una petición autenticada responde `401`:

1. Se elimina el token.
2. Se limpia el cache de TanStack Query.
3. Se elimina el usuario de monitoreo.
4. Se muestra un toast deduplicado de sesión expirada.
5. La ruta protegida reacciona al store y redirige al login.

El cliente no importa el router. También compara el token de la petición fallida con la
sesión actual para impedir que una respuesta antigua cierre una sesión nueva.

### Seguridad del token

El JWT se almacena en `localStorage` por decisión del proyecto. Esto mantiene la sesión al
reiniciar el navegador, pero incrementa el impacto potencial de un ataque XSS.

Medidas futuras recomendadas:

- Content Security Policy estricta.
- Evitar `dangerouslySetInnerHTML` con contenido no sanitizado.
- Revisar dependencias y scripts de terceros.
- No incluir tokens en logs, errores o contexto de monitoreo.

## Errores

`AppError` normaliza cualquier error a un contrato común:

- `message`
- `status`
- `code`
- `kind`
- `fieldErrors`
- `cause`

Kinds disponibles:

```text
api | network | validation | unauthorized | session-expired | canceled | unknown
```

Funciones públicas:

- `normalizeApiError`
- `getErrorMessage`
- `isCanceledError`
- `isSessionExpiredError`
- `shouldReportError`

Los mensajes predeterminados cubren `400`, `401`, `403`, `404`, `409`, `422`, `429` y
`500`. Si el backend devuelve un mensaje y errores de campos, se preservan.

## TanStack Query

Defaults actuales:

```text
staleTime: 1 minuto
gcTime: 10 minutos
refetchOnWindowFocus: false
mutations.retry: false
```

Política de queries:

- Red y `5xx`: máximo dos reintentos.
- `4xx`: sin reintento.
- Cancelaciones: sin reintento.
- Sesión expirada: sin reintento.

Política de mutations:

- Toast de error normalizado por defecto.
- Errores cancelados y sesión expirada no generan un segundo toast.
- Errores inesperados y `5xx` se reportan al proveedor de monitoreo.

Metadata tipada:

```ts
meta: {
  skipGlobalErrorToast: true,
  skipErrorReporting: true,
  errorMessage: 'No fue posible guardar el registro',
}
```

Las queries no muestran toast global para errores comunes, pero sí reportan errores
inesperados o `5xx` cuando el monitoreo está activo.

## Zustand

### `useAppStore`

Estado:

- `theme`: `light`, `dark` o `system`.
- `sidebarOpen`.

El tema y la preferencia del sidebar se persisten. El estado móvil del Sidebar permanece
temporal. Zustand DevTools se activa únicamente en desarrollo.

### `useAuthStore`

Estado:

- `accessToken`.
- `hasHydrated`.
- `setAccessToken`.
- `setHasHydrated`.
- `clearSession`.

Solo el JWT se persiste. `isAuthenticated` es un selector derivado y no se almacena. El
usuario se consulta con TanStack Query mediante `/auth/me`, evitando
duplicar estado de servidor en Zustand.

Al hidratar el store se elimina cualquier JWT mal formado, sin `exp` o vencido.

## Monitoreo opcional

La aplicación usa una fachada independiente del proveedor:

```ts
setupMonitoring()
reportError(error, context)
reportMessage(message, context)
setMonitoringUser({ id })
clearMonitoringUser()
```

Sin configuración, todas las operaciones son no-op. Si `VITE_SENTRY_ENABLED=true`,
`setupMonitoring()` carga dinámicamente el adaptador de Sentry.

### Privacidad

- No se habilita el envío de PII.
- Se eliminan headers `Authorization`, `Cookie` y `Set-Cookie`.
- Se eliminan parámetros `token`, `access_token` y `authorization` de URLs.
- El objeto original de Axios no se entrega a Sentry.
- Solo se permite asociar el ID del usuario; no email, roles, permisos ni JWT.

### Política de captura

Se reportan:

- Errores desconocidos.
- Errores HTTP `5xx`.
- Errores de render capturados por `ErrorBoundary`.

No se reportan:

- Cancelaciones.
- Errores de conexión del usuario.
- Validaciones y errores esperados `4xx`.
- Sesiones expiradas.

### Source maps

El plugin de Vite se activa únicamente cuando existen:

- `VITE_SENTRY_ENABLED=true`
- `VITE_SENTRY_RELEASE`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

En ese caso se generan source maps ocultos, se suben a Sentry y se eliminan de `dist`. Sin
esas credenciales no se generan ni se suben source maps.

Performance Tracing y Session Replay no están instalados ni habilitados.

### Integración en el bootstrap

`main.tsx` ejecuta `setupMonitoring()` antes de montar React y `AppErrorBoundary` llama a
`reportError` desde su callback `onError`.

## Hooks sugeridos

No se crearán hooks sin un consumidor real.

### Compartidos

| Hook | Propósito | Momento recomendado |
| --- | --- | --- |
| `useDebouncedValue` | Retardar búsquedas y filtros | Primer listado con búsqueda |
| `useIsMobile` | Detectar el breakpoint móvil | Sidebar responsive (implementado) |
| `useDisclosure` | Estado de dialog, drawer y popover | Primer overlay controlado |
| `useDocumentTitle` | Cambiar título por página | Bootstrap y rutas |
| `usePaginationParams` | Página, límite y filtros con nuqs | Primer listado paginado |
| `useDataTable` | Tabla server-side | Primer listado tabular |
| `useRowSelection` | Selección por ID | Acciones masivas |

### Hooks de módulo

Estos hooks viven en su dominio, no en `shared`:

- `useLogin`
- `useLogout`
- `useCurrentUser`
- `useTasks`
- `useCreateTask`
- `useToggleTask`
- `useDeleteTask`

No se recomienda crear wrappers genéricos como `useApi` o `useFetch`, porque ocultan query
keys, contratos y políticas específicas de cada dominio.

## Utilidades sugeridas

### Implementadas

| Archivo | Propósito |
| --- | --- |
| `class-name.utils.ts` | Combinar clases con clsx y tailwind-merge |
| `jwt.utils.ts` | Comprobar el claim `exp` del JWT |

### Bajo demanda

| Archivo | Propósito |
| --- | --- |
| `date.utils.ts` | Formatos de fecha con Day.js |
| `currency.utils.ts` | Formatos monetarios con `Intl.NumberFormat` |
| `download.utils.ts` | Descargar Blob y liberar URLs temporales |
| `string.utils.ts` | Helpers concretos, por ejemplo iniciales |
| `pagination.utils.ts` | Adaptar metadata de paginación si fuese necesario |

No se recomienda crear un `object.utils.ts` genérico ni duplicar la normalización de errores
fuera de `shared/lib/api`.

## Fases completadas

### Base y arquitectura

- Creación de `package.json` y lockfile con pnpm.
- Configuración de Vite, TypeScript, alias y proxy.
- Creación de la arquitectura modular y barrels iniciales.
- Creación del README desde cero.

### shadcn

- Configuración `radix-nova`.
- Workaround de alias para tsconfig con referencias.
- Scripts para agregar componentes y regenerar el barrel.
- Instalación del kit esencial y del Sidebar oficial de shadcn.

### ESLint

- Flat Config moderno.
- Formato sin punto y coma.
- Reglas type-aware, React Hooks y accesibilidad.
- Autofix automático después de shadcn.

### Infraestructura compartida

- Entorno validado.
- Clientes Axios.
- Errores normalizados.
- TanStack Query.
- Stores Zustand.
- JWT sin refresh token.
- Monitoreo opcional con Sentry.

### Bootstrap, tema y navegación

- Bootstrap asíncrono con MSW y monitoreo antes de montar React.
- Providers globales de Query, tema, tooltips, router, toasts y ErrorBoundary.
- Tokens semánticos, fuente Geist y temas claro, oscuro y sistema.
- Rutas lazy públicas y protegidas con `AuthenticatedLayout`.
- `AppSidebar` colapsable, `MainLayout` a ancho completo, `PageContainer` y página 404.
- Configuración única para navegación activa, breadcrumbs e iconos.
- Persistencia del estado de escritorio y Sheet móvil.
- Home protegida con una descripción breve del scaffold.

### Auth y mocks

- Login, logout y consulta `/auth/me` con contratos tipados.
- JWT persistido, hidratación controlada y validación de sesión.
- Usuario de monitoreo y cache limpiados al cerrar o expirar la sesión.
- MSW habilitado únicamente en desarrollo con credenciales demo documentadas en la UI.

### Showcase y módulo de ejemplo

- Kit esencial de shadcn instalado y expuesto en `/showcase`.
- Ejemplos de formularios, acciones, overlays, feedback, navegación y datos.
- Módulo neutral de tareas con adapters, schemas, services, hooks y componentes.
- Operaciones mock para listar, crear, completar y eliminar tareas.

### Testing

- Vitest, jsdom, React Testing Library, jest-dom y MSW configurados.
- Pruebas del login mock, adapter de tareas, navegación, persistencia y logout del layout.

## Pendiente

Esta sección contiene únicamente trabajo pendiente. Cuando una tarea se complete debe
eliminarse de aquí y registrarse de forma resumida en “Fases completadas”.

### Componentes compartidos

- [ ] Crear DataTable, paginación y selección al implementar el primer listado.
- [ ] Instalar nuevos componentes shadcn únicamente bajo demanda.

### Hooks y utilidades

- [ ] Crear `useDebouncedValue` cuando exista una búsqueda.
- [ ] Crear `useDisclosure` cuando exista un consumidor compartido.
- [ ] Crear `useDocumentTitle` con las rutas.
- [ ] Crear `usePaginationParams`, `useDataTable` y `useRowSelection` con el primer listado.
- [ ] Añadir utilidades de fecha, moneda, descarga y paginación solo con consumidores reales.

### Testing

- [ ] Definir el criterio de cobertura.
- [ ] Probar errores normalizados, interceptores, stores y sesión expirada.

### Git y automatización

- [ ] Inicializar el repositorio Git.
- [ ] Configurar Lefthook.
- [ ] Configurar Commitlint.
- [ ] Definir checks de pre-commit que no bloqueen innecesariamente el flujo.

### Documentación para agentes

- [ ] Crear `AGENTS.md` en español.
- [ ] Agregar configuración e instrucciones para OpenCode.
- [ ] Documentar convenciones completas de contribución.
- [ ] Mantener actualizado este documento con cada cambio.

## Criterio de actualización

Al completar una fase se debe:

1. Actualizar la sección técnica afectada.
2. Eliminar de “Pendiente” todas las tareas completadas.
3. Registrar un resumen de lo terminado en “Fases completadas”.
4. Documentar variables, scripts y dependencias nuevas.
5. Registrar decisiones de seguridad o trade-offs relevantes.
6. Evitar describir como funcional aquello que todavía no esté montado o verificado.
