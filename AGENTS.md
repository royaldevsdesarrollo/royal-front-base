# Royal Stack Web

Scaffold frontend independiente con Vite, React y TypeScript estricto. Las convenciones son
parte del producto: los proyectos derivados deben recibir una base coherente, no excepciones
específicas de una aplicación.

## Lecturas obligatorias

Antes de modificar arquitectura o módulos, consulta:

- [`docs/PROJECT.md`](./docs/PROJECT.md): estado, stack, infraestructura y pendientes.
- [`docs/MODULES.md`](./docs/MODULES.md): anatomía, flujo y checklist de módulos.
- [`docs/SKILLS.md`](./docs/SKILLS.md): catálogo de skills instaladas.

Si el código contradice la documentación, verifica el comportamiento actual y actualiza ambos
como parte del mismo cambio. No documentes como funcional algo que no esté implementado.

## Idiomas

- Documentación, comentarios y JSDoc: español.
- Textos visibles para usuarios: español.
- Identificadores, archivos y carpetas: inglés.

## Comandos

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm test
pnpm test:watch
pnpm ui:add <component>
pnpm ui:barrel
```

Antes de terminar un cambio ejecuta:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Ejecuta también `pnpm build` cuando cambien rutas, exports, dependencias, configuración,
providers o bootstrap.

## Uso de skills

Las skills instaladas en `.agents/skills/` aportan conocimiento especializado, pero no
reemplazan las convenciones de este archivo ni de `docs/PROJECT.md` y `docs/MODULES.md`. Si una
skill contradice el proyecto, prevalece la convención local.

- `frontend-architecture`: al escribir, revisar o refactorizar arquitectura frontend.
- `vercel-react-best-practices`: al trabajar con React, rendimiento, fetching o bundles;
  aplica solo recomendaciones compatibles con Vite y el stack existente.
- `vercel-composition-patterns`: al diseñar APIs reutilizables o corregir proliferación de
  props booleanas.
- `shadcn`: al agregar, modificar, depurar o componer componentes shadcn.
- `web-design-guidelines`: después de implementar una interfaz relevante, para revisar UX,
  responsive design y accesibilidad.
- `webapp-testing`: para validar en navegador flujos funcionales que atraviesan varios
  componentes o rutas; complementa, no sustituye, Vitest y Testing Library.
- `systematic-debugging`: ante bugs, tests fallidos o comportamiento inesperado; reproduce,
  reúne evidencia, aísla la causa raíz y solo entonces corrige.
- `verification-before-completion`: antes de afirmar que un cambio está terminado o funciona;
  exige evidencia reciente de los comandos y flujos relevantes.

## Arquitectura

```text
src/
├── main.tsx / App.tsx
├── routes/
├── pages/
├── modules/
├── mocks/
└── shared/
```

Flujo principal:

```text
components → hooks → services → apiClient
```

Reglas:

- `shared` nunca importa desde `modules`.
- Las páginas componen y coordinan la ruta; las reglas de negocio viven en módulos.
- Los componentes no llaman Axios directamente.
- Los services no contienen React, navegación, toasts ni JSX.
- TanStack Query contiene estado del servidor; Zustand contiene estado cliente o de sesión.
- `tasks` es el módulo neutral de referencia.
- `auth` es una integración transversal y no debe copiarse como plantilla universal.
- Crea solo carpetas y abstracciones con consumidores reales.

## Imports y barrels

- Usa el alias `@/`; evita imports relativos profundos.
- Desde fuera de un módulo, importa su barrel raíz: `@/modules/tasks`.
- Dentro de un módulo, usa barrels de subcarpetas para dependencias entre capas.
- Imports relativos entre archivos hermanos y tests colocados junto al código son válidos.
- Usa named exports en barrels.
- Usa `import type` para imports exclusivamente de tipos.
- No expongas services o adapters desde la raíz sin una necesidad externa concreta.

## Código y estilo

- TypeScript estricto y sin `any` explícito.
- Dos espacios, comillas simples y sin punto y coma.
- Un componente React principal por archivo.
- Componentes y páginas en `PascalCase.tsx`.
- Hooks con prefijo `use`.
- Services, schemas, adapters y tipos con sus sufijos documentados.
- Deriva valores durante el render en lugar de sincronizarlos con estado y efectos innecesarios.
- Mantén la lógica causada por una interacción en su event handler, no en un efecto indirecto.
- Prefiere composición y variantes explícitas frente a componentes con muchas props booleanas.
- Usa `cn()` para combinar clases.
- Usa tokens semánticos; no hardcodees colores de marca en componentes.
- Conserva estados de carga, error, vacío y éxito cuando sean relevantes.

## UI y shadcn

- La skill `shadcn` es conocimiento de apoyo. No tiene autoridad para cambiar la ubicación de
  componentes, el preset, `components.json`, el barrel generado ni los comandos definidos por
  `royal-stack-web`. Ante cualquier contradicción, prevalecen las convenciones locales.
- Agrega componentes solo con un consumidor real mediante `pnpm ui:add <component>`; no
  sustituyas este flujo por una ejecución remota sin una razón técnica concreta.
- Mantén los componentes generados en `src/shared/components/ui/`.
- `src/shared/components/ui/index.ts` es generado: no lo edites manualmente.
- Regenera el barrel con `pnpm ui:barrel` cuando una operación excepcional no pase por
  `pnpm ui:add`.
- Conserva nombres kebab-case de archivos generados por shadcn.
- Revisa imports de `cn`, accesibilidad y lint después de generar componentes.
- Los componentes propios fuera de `ui` usan `PascalCase.tsx`.
- Para comportamiento de negocio, compón primitives desde el módulo en lugar de introducirlo
  en un componente shadcn global.
- Revisa consumidores antes de modificar una API existente de shadcn.
- Los tokens viven en `src/shared/assets/styles/theme.css`.

## Datos, errores y sesión

- Centraliza endpoints en `API_ENDPOINTS` y query keys en `QUERY_KEYS`.
- Usa `publicApiClient` solo sin sesión y `apiClient` para recursos autenticados.
- Devuelve modelos de dominio desde services; adapta DTOs cuando las formas difieran.
- No fuerces `Content-Type` globalmente.
- Respeta el manejo central de `AppError`, Query y expiración de sesión.
- Nunca registres JWT, credenciales, PII o headers sensibles.

## Forms y mocks

- Usa React Hook Form y Zod para formularios validados.
- Infiere tipos desde schemas cuando corresponda.
- Conecta labels, `aria-invalid` y mensajes visibles.
- Los mocks deben reproducir DTOs, envelopes y errores del backend.
- Registra handlers nuevos en `src/mocks/handlers.ts`.
- Añade reset explícito para fixtures mutables usadas por tests.

## Consulta antes de cambiar

- Dependencias heredadas por todos los proyectos derivados.
- Estructura de carpetas o límites arquitectónicos.
- Tokens o estructura de `theme.css`.
- Política de autenticación, JWT o errores globales.
- Contratos persistidos o comportamiento público existente.

## Nunca

- Incluyas secretos o archivos `.env` en control de versiones.
- Reviertas cambios ajenos sin autorización.
- Dupliques endpoints, query keys o normalización de errores.
- Guardes estado de servidor en Zustand.
- Crees wrappers genéricos como `useApi` que oculten contratos del dominio.
- Añadas compatibilidad retroactiva sin un consumidor o requisito concreto.
- Marques una tarea documental como completada antes de verificar código y comandos.
