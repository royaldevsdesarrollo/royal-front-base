# Módulos de negocio

## Propósito

Cada carpeta bajo `src/modules/<module>` encapsula un dominio o capacidad de negocio. Este
documento es la referencia canónica para crear, ampliar o revisar módulos en
`royal-stack-web`, tanto para personas como para agentes de IA.

Los módulos exponen una API pública mediante su `index.ts`. Las páginas y otros consumidores
externos deben usar esa API en lugar de importar detalles internos.

La regla principal es crear únicamente las capas y carpetas que tengan una responsabilidad y
un consumidor reales. La anatomía completa es una lista de posibilidades, no una plantilla
que deba copiarse vacía.

## Límites arquitectónicos

```text
routes → pages → modules → shared
                  ↓
             módulo actual
```

- `shared` no importa desde `modules`.
- Un módulo no importa otro módulo salvo que exista una decisión arquitectónica explícita.
- Las páginas componen módulos y UI compartida; no ejecutan peticiones HTTP directamente.
- La orquestación de ruta, como redirects o lectura de `location.state`, puede vivir en una
  página o componente de ruta.
- Zustand almacena estado cliente o de sesión. TanStack Query almacena estado del servidor.
- Los componentes no usan Axios directamente.
- Los services no contienen JSX, hooks, navegación ni estado React.
- Los mocks pueden importar tipos públicos de módulos y constantes de `shared/config`.

Antes de mover código a `shared`, debe existir reutilización real entre dominios. Una utilidad
usada por un solo módulo permanece dentro de ese módulo.

## Anatomía de un módulo

```text
src/modules/<module>/
├── adapters/        # Transformaciones puras entre DTOs y modelos
├── components/      # Formularios, listas y UI propia del dominio
├── constants/       # Constantes exclusivas del dominio
├── hooks/           # Queries, mutations y orquestación React
├── schemas/         # Validación Zod y tipos inferidos
├── services/        # Operaciones HTTP sin lógica React
├── types/           # Modelos, DTOs y comandos del dominio
├── utils/           # Funciones puras exclusivas del módulo
└── index.ts         # API pública del módulo
```

No todos los módulos necesitan todas las carpetas. No se deben crear directorios vacíos para
anticipar necesidades futuras.

### Ejemplo actual: `tasks`

```text
src/modules/tasks/
├── adapters/
│   ├── task.adapter.ts
│   ├── task.adapter.test.ts
│   └── index.ts
├── components/
│   ├── CreateTaskForm.tsx
│   ├── TaskList.tsx
│   ├── TasksPanel.tsx
│   └── index.ts
├── hooks/
│   ├── useTasks.ts
│   └── index.ts
├── schemas/
│   ├── task.schema.ts
│   └── index.ts
├── services/
│   ├── task.service.ts
│   └── index.ts
├── types/
│   ├── task.types.ts
│   └── index.ts
└── index.ts
```

## Responsabilidades por capa

| Capa | Responsabilidad | No debe hacer |
| --- | --- | --- |
| `types` | Modelos, DTOs y comandos | Ejecutar lógica o peticiones |
| `schemas` | Validar entradas en runtime | Sustituir los modelos del dominio sin decisión explícita |
| `adapters` | Transformar contratos mediante funciones puras | Usar React, Query o Axios |
| `services` | Ejecutar HTTP, desenvolver respuestas y aplicar adapters | Navegar, mostrar toasts o manejar estado React |
| `hooks` | Coordinar Query, mutations y efectos del dominio | Renderizar JSX o construir URLs HTTP repetidas |
| `components` | Renderizar estados y capturar interacción | Llamar Axios directamente |
| `pages` | Componer módulos y coordinar la ruta | Implementar reglas del dominio o duplicar services |
| `mocks` | Reproducir el contrato del backend | Devolver modelos adaptados si la API real devuelve DTOs |

## Flujo de datos

### Consulta

```text
component
  → query hook
  → service
  → apiClient
  → ApiResponse<Dto>
  → adapter opcional
  → domain model
  → TanStack Query cache
  → component
```

Ejemplo real:

```text
TaskList
  → useTasks
  → getTasks
  → apiClient.get('/tasks')
  → TaskDto[]
  → adaptTask
  → Task[]
```

### Mutación

```text
component
  → mutation hook
  → service
  → apiClient
  → adapter opcional
  → invalidación o actualización del cache
  → UI actualizada
```

`useCreateTask`, `useToggleTask` y `useDeleteTask` invalidan `QUERY_KEYS.TASKS` después de una
operación correcta. El módulo actual no utiliza actualizaciones optimistas.

### Adaptación de respuesta

El flujo corto `components → hooks → services → apiClient` describe las dependencias de
salida. En el regreso, el service desenvuelve `response.data.data` y llama al adapter cuando
el contrato HTTP difiere del modelo utilizado por la UI.

## Módulos de referencia

### `tasks`: referencia general

`src/modules/tasks` es el patrón principal para módulos de negocio porque demuestra:

- DTO separado del modelo del dominio.
- Adapter puro y probado.
- Query y mutations.
- Invalidación de cache.
- Formulario con React Hook Form y Zod.
- Estados de carga, error, vacío y datos.
- Cliente HTTP autenticado.
- Handlers de MSW.
- Página que consume el barrel público del módulo.

### `auth`: referencia especializada

`src/modules/auth` coordina responsabilidades transversales que no pertenecen a un módulo
normal:

- Cliente HTTP público para login.
- Persistencia e hidratación del JWT.
- Validación de sesión mediante `/auth/me`.
- Rutas protegidas y redirects.
- Limpieza completa del cache al cerrar o expirar la sesión.
- Asociación del usuario con monitoreo.
- Montaje de `MainLayout`.

Un módulo ordinario no debe copiar stores, redirects, monitoreo o control del layout solo
porque Auth los utiliza.

## Tipos, DTOs y adapters

Los tipos de transporte y los modelos del dominio se separan cuando sus representaciones no
coinciden.

```ts
interface TaskDto {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

interface Task {
  id: string
  title: string
  isDone: boolean
  createdAt: Date
}
```

El adapter convierte `is_done` en `isDone` y la fecha ISO en `Date`.

Se debe crear un adapter cuando cambien casing, fechas, enums, anidación, nulabilidad o forma
de los datos. Si el contrato HTTP ya coincide con el modelo, no se añade una capa artificial.

Los genéricos de Axios solo aportan tipos estáticos. No validan la respuesta en runtime. Si
un endpoint requiere validación de respuesta, debe añadirse un schema específico y parsear el
payload de forma explícita.

Los adapters deben ser funciones puras y tener tests cuando la transformación no sea trivial.

## Services y clientes HTTP

- Usa `publicApiClient` únicamente para endpoints que no requieren una sesión existente.
- Usa `apiClient` para endpoints autenticados.
- Declara endpoints estáticos o paths base en `API_ENDPOINTS`.
- Construye paths dinámicos en el service a partir del path base.
- Tipa el envelope con `ApiResponse<T>`.
- Devuelve datos de dominio, no la respuesta completa de Axios.
- Aplica adapters antes de devolver los datos al hook.
- No fuerces `Content-Type`; el cliente admite JSON y `FormData`.

```ts
export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get<ApiResponse<TaskDto[]>>(API_ENDPOINTS.TASKS)
  return response.data.data.map(adaptTask)
}
```

Los services se exportan desde `services/index.ts`, pero permanecen fuera del barrel raíz del
módulo salvo que un consumidor externo necesite usarlos directamente.

## Hooks y TanStack Query

- Añade query keys estables a `QUERY_KEYS`.
- Usa la misma key para consulta e invalidación.
- Crea un factory de keys solo cuando existan detalles, filtros o paginación que lo justifiquen.
- Define si una mutación invalida, actualiza directamente o usa una actualización optimista.
- Usa `meta.errorMessage` para mensajes de operación mostrados por el manejador global.
- Usa `skipGlobalErrorToast` cuando el componente renderice el error inline.
- Usa `skipErrorReporting` solo para errores deliberadamente esperados.
- Mantén loading, error y empty states visibles en el componente consumidor.

Política global actual:

- Queries de red o `5xx`: hasta dos reintentos.
- Queries `4xx`, canceladas o con sesión expirada: sin reintento.
- Mutations: sin reintento y con toast normalizado por defecto.
- Errores inesperados y `5xx`: reportados al proveedor de monitoreo.

No existe todavía una convención global de `mutationKey`: login define una y las mutations de
tasks no. No se debe inventar una regla nueva dentro de un único módulo sin documentarla.

## Formularios

1. Crea el schema en `schemas/<concern>.schema.ts`.
2. Infiere el tipo con `z.infer`.
3. Usa `zodResolver` con React Hook Form.
4. Declara `defaultValues` explícitos.
5. Usa `noValidate` para evitar competir con validación nativa.
6. Conecta labels mediante `htmlFor` e `id`.
7. Expone `aria-invalid` y un mensaje visible por campo.
8. Deshabilita el submit mientras la mutation esté pendiente.
9. Define explícitamente el comportamiento de éxito.

El tipo del formulario y el input del service pueden coincidir o ser contratos diferentes. Si
difieren, debe existir una transformación explícita antes de invocar el service.

`AppError` preserva `fieldErrors`, pero los formularios actuales todavía no los convierten en
`form.setError`. Si un módulo lo implementa, debe hacerlo de forma consistente y probarlo.

## Páginas, rutas y navegación

Para exponer un módulo como pantalla protegida:

1. Crea `src/pages/<domain>/<Name>Page.tsx`.
2. Exporta la página desde `src/pages/<domain>/index.ts`.
3. Añade la URL a `ROUTES`.
4. Crea un lazy import en `src/routes/index.tsx`.
5. Registra la ruta como hija de `AuthenticatedLayout`.
6. Añade un item a `NAVIGATION_ITEMS` solo si debe mostrarse en el Sidebar.
7. Verifica el matching de `end`, el estado activo y el breadcrumb.
8. Prueba acceso directo y navegación.

Las rutas públicas se registran fuera de `AuthenticatedLayout`. La ruta `*` actual también es
pública y renderiza la página 404 sin el layout autenticado.

Una ruta no necesita aparecer en el Sidebar. Router y navegación son configuraciones
separadas, por lo que ambas deben revisarse al agregar una pantalla visible.

## Mocks

```text
src/mocks/
├── auth.handlers.ts
├── task.handlers.ts
├── handlers.ts
└── browser.ts
```

- Crea un archivo de handlers por dominio.
- Reutiliza `API_ENDPOINTS` para evitar paths divergentes.
- Devuelve el mismo envelope y DTOs que devolvería el backend.
- Incluye respuestas de autorización, validación y not-found cuando sean relevantes.
- Registra el grupo en `mocks/handlers.ts`.
- Mantén los mocks fuera del bundle de producción mediante la carga dinámica existente.
- Proporciona un reset explícito si el handler modifica fixtures en memoria.

`server.resetHandlers()` restaura handlers sobrescritos, pero no reinicia automáticamente
arrays mutables declarados a nivel de módulo.

## Barrels e imports

### Desde fuera del módulo

Usa el barrel público:

```ts
import { TasksPanel } from '@/modules/tasks'
```

### Entre carpetas del mismo módulo

Usa el barrel de la subcarpeta:

```ts
import { createTask } from '@/modules/tasks/services'
import type { TaskDto } from '@/modules/tasks/types'
```

### Dentro de la misma carpeta

Los imports relativos entre archivos hermanos y tests colocados junto al código son válidos:

```ts
import { CreateTaskForm } from './CreateTaskForm'
```

El barrel raíz debe exponer únicamente la API destinada a consumidores externos. La mera
existencia de un service o adapter no obliga a exportarlo desde la raíz.

No se usan los barrels agregados `@/modules`, `@/pages` o `@/shared` como API preferida. Los
imports por dominio preservan límites claros y lazy loading enfocado.

## Convenciones de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Módulo | Nombre de dominio en inglés | `tasks`, `auth` |
| Componente | `PascalCase.tsx` | `TaskList.tsx` |
| Página | Sufijo `Page` | `ExamplePage.tsx` |
| Hook | Prefijo `use` | `useTasks.ts` |
| Service | `<domain>.service.ts` | `task.service.ts` |
| Schema | `<concern>.schema.ts` | `task.schema.ts` |
| Tipos | `<domain>.types.ts` | `task.types.ts` |
| Adapter | `<domain>.adapter.ts` | `task.adapter.ts` |
| Mock | `<domain>.handlers.ts` | `task.handlers.ts` |
| Test | Colocado junto al código | `task.adapter.test.ts` |
| DTO | Sufijo `Dto` | `TaskDto` |
| Formulario | Sufijo `FormData` | `CreateTaskFormData` |
| Comando | Sufijo `Input` | `CreateTaskInput` |

Documentación, comentarios, JSDoc y textos visibles se escriben en español. Identificadores,
archivos y carpetas se escriben en inglés.

## Testing

El tipo de prueba depende de la responsabilidad:

- Adapters y utils: test unitario puro.
- Schemas: casos válidos y límites importantes.
- Formularios: validación, pending, éxito y error con Testing Library.
- Hooks y services: integración con Query y MSW cuando aporte confianza real.
- Mutations: invalidación o actualización del cache.
- Rutas visibles: acceso, navegación activa y breadcrumb.

Cada test debe restaurar los recursos que modifica: handlers, fixtures mutables, Query cache,
stores, `localStorage` y mocks.

La suite actual no cubre todavía interceptores, expiración de sesión, hidratación ni el flujo
CRUD completo de tasks. Esas carencias permanecen registradas en `docs/PROJECT.md`.

## Checklist para un nuevo módulo

### Dominio y límites

- [ ] Elegir un nombre de dominio en inglés.
- [ ] Definir qué pertenece al módulo y qué es realmente compartido.
- [ ] Evitar dependencias con otros módulos salvo decisión explícita.
- [ ] Crear únicamente las carpetas necesarias.

### Contratos y datos

- [ ] Definir modelos e inputs en `types`.
- [ ] Añadir DTOs cuando el contrato HTTP difiera del dominio.
- [ ] Crear adapters puros solo cuando exista una transformación real.
- [ ] Probar adapters no triviales.
- [ ] Decidir si la respuesta necesita validación runtime.

### Endpoints y services

- [ ] Añadir paths base a `API_ENDPOINTS`.
- [ ] Elegir `apiClient` o `publicApiClient` deliberadamente.
- [ ] Tipar el envelope con `ApiResponse<T>`.
- [ ] Desenvolver y adaptar la respuesta dentro del service.
- [ ] Mantener React, navegación y toasts fuera del service.
- [ ] Exportar operaciones desde `services/index.ts`.

### Query hooks

- [ ] Añadir una key estable a `QUERY_KEYS`.
- [ ] Usar la misma key para fetch e invalidación.
- [ ] Definir loading, error y empty states.
- [ ] Elegir invalidación, actualización directa u optimistic update.
- [ ] Configurar metadata de errores cuando corresponda.
- [ ] Evitar wrappers genéricos que oculten contratos del dominio.

### Formularios

- [ ] Crear schema Zod si existe entrada de usuario.
- [ ] Inferir el tipo del formulario.
- [ ] Configurar default values y `noValidate`.
- [ ] Añadir labels, `aria-invalid` y mensajes visibles.
- [ ] Deshabilitar el submit mientras está pendiente.
- [ ] Definir reset, cierre, toast o navegación de éxito.
- [ ] Decidir cómo mapear errores de campos del backend.

### Componentes y API pública

- [ ] Mantener HTTP detrás de hooks.
- [ ] Renderizar estados pending, error, vacío y éxito relevantes.
- [ ] Exportar desde `components/index.ts` solo componentes reutilizables externamente.
- [ ] Exponer en el barrel raíz únicamente la API pública del módulo.

### Páginas y navegación

- [ ] Crear una página solo si existe composición a nivel de ruta.
- [ ] Añadir `ROUTES` y registrar el lazy route.
- [ ] Elegir conscientemente entre ruta pública o protegida.
- [ ] Añadir navegación solo si la página debe aparecer en el Sidebar.
- [ ] Verificar estado activo y breadcrumb.

### Mocks

- [ ] Añadir handlers del dominio.
- [ ] Reutilizar `API_ENDPOINTS`.
- [ ] Devolver DTOs y envelopes reales.
- [ ] Incluir errores relevantes.
- [ ] Registrar handlers en `mocks/handlers.ts`.
- [ ] Añadir reset para fixtures mutables.

### Verificación

- [ ] Añadir tests proporcionales al riesgo.
- [ ] Ejecutar `pnpm lint`.
- [ ] Ejecutar `pnpm typecheck`.
- [ ] Ejecutar `pnpm test`.
- [ ] Ejecutar `pnpm build` si cambian rutas, exports, dependencias o configuración.
- [ ] Actualizar `README.md`, `docs/PROJECT.md` o esta guía si cambia una convención.

## Antipatrones

- Llamar Axios desde un componente o página.
- Guardar en Zustand datos que ya pertenecen al cache de Query.
- Crear todas las carpetas posibles sin consumidores.
- Usar Auth como plantilla universal para un dominio normal.
- Duplicar strings de endpoints o query keys.
- Transformar DTOs dentro de componentes.
- Añadir un adapter que solo copie propiedades idénticas.
- Exponer services y adapters desde la raíz sin consumidores externos.
- Ocultar query keys, errores o políticas detrás de un `useApi` genérico.
- Importar implementaciones internas de otro módulo.
- Añadir una ruta visible sin revisar Sidebar y breadcrumb.
- Usar `any`, imports relativos profundos o exports default en barrels.
- Declarar como implementado un flujo que no se haya verificado.

## Definición de terminado

Un módulo está terminado cuando:

- Respeta los límites y convenciones de este documento.
- Expone una API pública mínima y clara.
- Sus contratos HTTP, modelos y adapters son coherentes.
- Renderiza los estados relevantes para el usuario.
- Dispone de mocks y tests proporcionales a su comportamiento.
- La navegación y documentación están sincronizadas.
- `pnpm lint`, `pnpm typecheck` y `pnpm test` pasan.
- `pnpm build` pasa cuando el cambio afecta integración o estructura.
