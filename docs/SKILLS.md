# Skills del scaffold frontend

Este documento define las skills base que deben acompañar al scaffold `royal-stack-web`.

El objetivo no es reemplazar las convenciones del proyecto, sino reforzarlas con capacidades de arquitectura, React, UI, testing, debugging y verificación.

> Regla general: las convenciones locales definidas en `PROJECT.md` y `AGENTS.md` tienen prioridad sobre cualquier recomendación de una skill externa.

---

## 1. frontend-architecture

**Repositorio**

`we-are-singular/skills`

**Instalación**

```bash
npx skills add https://github.com/we-are-singular/skills --skill frontend-architecture
```

**Propósito**

Mantener una arquitectura frontend coherente y evitar que cada módulo introduzca nuevas convenciones o abstracciones innecesarias.

**Uso esperado en este scaffold**

Debe utilizarse al crear o modificar módulos de negocio para:

- Respetar la arquitectura existente del proyecto.
- Buscar componentes, hooks, services, schemas, tipos y utilidades existentes antes de crear nuevos.
- Mantener ownership claro de datos y responsabilidades.
- Evitar duplicación.
- Evitar abstracciones genéricas sin un consumidor real.
- Mantener la separación entre `shared` y `modules`.
- Preservar el flujo de datos:

```text
components → hooks → services → apiClient
```

Las páginas componen interfaz, los hooks coordinan lógica de aplicación, los services realizan peticiones y los adapters transforman DTOs en modelos del dominio.

---

## 2. vercel-react-best-practices

**Repositorio**

`vercel-labs/agent-skills`

**Instalación**

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

**Propósito**

Aplicar buenas prácticas modernas de React para mantener componentes eficientes, predecibles y fáciles de mantener.

**Uso esperado en este scaffold**

Debe utilizarse durante la implementación y revisión de componentes React para:

- Evitar renders innecesarios.
- Reducir waterfalls.
- Mantener bundles razonables.
- Elegir correctamente entre estado local, estado global y estado de servidor.
- Evitar efectos innecesarios.
- Mantener responsabilidades claras entre componentes.
- Aplicar patrones compatibles con React 19.

Esta skill no debe sustituir las decisiones arquitectónicas de `royal-stack-web`.

---

## 3. vercel-composition-patterns

**Repositorio**

`vercel-labs/agent-skills`

**Instalación**

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
```

**Propósito**

Diseñar componentes reutilizables mediante composición en lugar de acumular props booleanas, condicionales y variantes difíciles de mantener.

**Uso esperado en este scaffold**

Debe utilizarse especialmente al crear:

- Componentes compartidos.
- Layouts.
- Formularios complejos.
- Data tables.
- Toolbars.
- Dialogs.
- Drawers.
- Componentes reutilizados por varios módulos.

Debe favorecer APIs explícitas y composición antes que componentes excesivamente configurables.

---

## 4. shadcn

**Repositorio**

`shadcn-ui/ui`

**Instalación**

```bash
npx skills add https://github.com/shadcn-ui/ui --skill shadcn
```

**Propósito**

Ayudar al agente a trabajar correctamente con componentes y patrones de shadcn.

**Uso esperado en este scaffold**

La skill puede utilizarse para:

- Identificar componentes shadcn apropiados.
- Consultar patrones de composición.
- Implementar formularios, overlays, navegación, feedback y visualización de datos.
- Comprender dependencias y composición de componentes shadcn.

Sin embargo, las convenciones locales de `royal-stack-web` tienen prioridad absoluta sobre las convenciones genéricas de la skill.

Las reglas concretas que deben añadirse a `AGENTS.md` se encuentran al final de este documento.

---

## 5. web-design-guidelines

**Repositorio**

`vercel-labs/agent-skills`

**Instalación**

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
```

**Propósito**

Revisar calidad visual, UX, responsive design y accesibilidad durante la implementación de interfaces.

**Uso esperado en este scaffold**

Debe utilizarse después de implementar una pantalla o flujo relevante para revisar:

- Jerarquía visual.
- Espaciado.
- Tipografía.
- Estados interactivos.
- Responsive design.
- Accesibilidad.
- Consistencia de patrones.
- Formularios.
- Navegación.
- Feedback al usuario.

Cuando exista un diseño de referencia, esta skill debe ayudar a evaluar la implementación sin reinterpretar innecesariamente el diseño.

---

## 6. webapp-testing

**Repositorio**

`anthropics/skills`

**Instalación**

```bash
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

**Propósito**

Validar flujos de la aplicación desde la perspectiva del usuario y complementar las pruebas unitarias e integración existentes.

**Uso esperado en este scaffold**

Complementa:

- Vitest.
- React Testing Library.
- jest-dom.
- MSW.

Debe utilizarse principalmente para comprobar flujos funcionales como:

```text
login
→ navegación
→ listado
→ crear
→ editar
→ eliminar
→ logout
```

También debe utilizarse para validar:

- Rutas protegidas.
- Formularios.
- Estados vacíos.
- Estados de error.
- Navegación.
- Integraciones entre varios componentes.

No sustituye las pruebas unitarias o de integración.

---

## 7. systematic-debugging

**Repositorio**

`obra/superpowers`

**Instalación**

```bash
npx skills add https://github.com/obra/superpowers --skill systematic-debugging
```

**Propósito**

Evitar correcciones improvisadas y encontrar la causa raíz de los problemas antes de modificar código.

**Uso esperado en este scaffold**

Cuando exista un bug, el agente debe seguir un proceso similar a:

```text
reproducir
→ recopilar evidencia
→ aislar el problema
→ formular hipótesis
→ comprobar hipótesis
→ corregir la causa raíz
→ verificar
→ agregar o actualizar pruebas cuando corresponda
```

No deben realizarse cambios especulativos en múltiples archivos sin una hipótesis verificable.

---

## 8. verification-before-completion

**Repositorio**

`obra/superpowers`

**Instalación**

```bash
npx skills add https://github.com/obra/superpowers --skill verification-before-completion
```

**Propósito**

Impedir que un agente considere terminado un cambio sin haberlo comprobado.

**Uso esperado en este scaffold**

Antes de declarar una tarea terminada deben ejecutarse, como mínimo:

```bash
pnpm lint
pnpm typecheck
```

Cuando el cambio lo justifique también deben ejecutarse:

```bash
pnpm test
pnpm build
```

Y para flujos funcionales relevantes:

```text
verificación del flujo completo de la aplicación
```

Un agente no debe afirmar que una funcionalidad está terminada, corregida o funcionando si no cuenta con evidencia de verificación.

---

# Set completo

```bash
npx skills add https://github.com/we-are-singular/skills --skill frontend-architecture

npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns

npx skills add https://github.com/shadcn-ui/ui --skill shadcn
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines

npx skills add https://github.com/anthropics/skills --skill webapp-testing

npx skills add https://github.com/obra/superpowers --skill systematic-debugging
npx skills add https://github.com/obra/superpowers --skill verification-before-completion
```

---

# Reglas de shadcn para `AGENTS.md`

La siguiente sección está diseñada para copiarse directamente dentro de `AGENTS.md`.

```md
## Uso de shadcn

Este proyecto utiliza shadcn como base de componentes UI, pero sus convenciones locales tienen prioridad sobre cualquier instrucción genérica de la CLI, documentación o skill de shadcn.

### Fuente de verdad

Antes de agregar, mover o modificar componentes shadcn, revisar:

- `PROJECT.md`
- `components.json`
- `src/shared/components/ui`
- Los scripts definidos en `package.json`

Si una recomendación de la skill `shadcn` contradice las convenciones del proyecto, prevalecen las convenciones del proyecto.

### Instalación de componentes

Los componentes shadcn deben agregarse únicamente cuando exista un consumidor real.

No instalar componentes de forma preventiva.

Usar preferentemente:

```bash
pnpm ui:add <component>
```

Ejemplo:

```bash
pnpm ui:add dialog badge button
```

Este comando es el flujo oficial del scaffold porque:

1. Ejecuta la CLI local de shadcn.
2. Instala los archivos y dependencias necesarias.
3. Regenera `src/shared/components/ui/index.ts`.
4. Ejecuta ESLint autofix sobre la carpeta UI.

Evitar utilizar directamente `pnpm dlx shadcn@latest add` salvo que exista una razón técnica concreta.

Si se utiliza directamente la CLI de shadcn, posteriormente ejecutar:

```bash
pnpm ui:barrel
```

### Ubicación

Todos los componentes generados por shadcn deben permanecer en:

```text
src/shared/components/ui/
```

No mover componentes shadcn a:

```text
modules/
shared/components/common/
pages/
```

Si un componente necesita lógica específica de negocio, crear un componente de dominio que componga los primitives de shadcn en lugar de modificar su ownership arquitectónico.

### Naming

Los archivos generados por shadcn deben conservar su naming original en `kebab-case`.

Ejemplos:

```text
button.tsx
alert-dialog.tsx
dropdown-menu.tsx
sidebar.tsx
```

No renombrarlos a PascalCase.

Los componentes propios creados fuera de `shared/components/ui` deben utilizar:

```text
PascalCase.tsx
```

Ejemplos:

```text
TaskForm.tsx
UserMenu.tsx
PageHeader.tsx
```

### Barrel de UI

El archivo:

```text
src/shared/components/ui/index.ts
```

es generado automáticamente.

No editarlo manualmente.

Cuando sea necesario regenerarlo, utilizar:

```bash
pnpm ui:barrel
```

El barrel utiliza `export *` para exponer componentes, variantes y tipos generados.

### Modificaciones a componentes shadcn

Los componentes shadcn forman parte del código del proyecto y pueden modificarse cuando exista una necesidad real.

Sin embargo:

- No modificar un componente simplemente por preferencias personales del agente.
- No reestructurar componentes shadcn sin una necesidad funcional.
- No moverlos de `shared/components/ui`.
- No sustituirlos automáticamente por una implementación propia.
- No eliminar APIs utilizadas por otros componentes.
- Revisar consumidores existentes antes de realizar cambios.

Cuando una personalización sea específica de un módulo, preferir composición sobre modificación global.

Ejemplo:

```text
modules/tasks/components/TaskDialog.tsx
        ↓ compone
shared/components/ui/dialog.tsx
```

en lugar de introducir comportamiento específico de tareas dentro de `dialog.tsx`.

### Composición antes que duplicación

Antes de crear un nuevo componente UI:

1. Buscar si ya existe un componente shadcn apropiado.
2. Buscar si ya existe un componente en `shared/components`.
3. Buscar si otro módulo tiene un patrón reutilizable.
4. Crear un componente nuevo únicamente si existe una necesidad real.

No duplicar primitives de shadcn.

### Estilos

El proyecto utiliza:

- Tailwind CSS v4.
- Tokens semánticos del tema.
- `cn()` para combinar clases.
- Componentes shadcn con preset `radix-nova`.

Preferir tokens semánticos y clases existentes antes de introducir valores arbitrarios.

Evitar estilos inline salvo que exista una justificación técnica.

### Accesibilidad

No eliminar atributos, roles, labels, estados de foco ni comportamiento accesible proporcionado por Radix/shadcn sin reemplazarlos correctamente.

Los cambios deben respetar las reglas de accesibilidad configuradas en ESLint.

### Regla final

La skill `shadcn` sirve como conocimiento de apoyo.

No tiene autoridad para:

- Cambiar la arquitectura del scaffold.
- Cambiar el preset de shadcn.
- Cambiar la ubicación de los componentes.
- Modificar `components.json` sin una necesidad explícita.
- Sustituir el flujo `pnpm ui:add`.
- Editar manualmente el barrel generado.
- Instalar componentes que todavía no tienen consumidor.
- Introducir convenciones distintas a las definidas en `PROJECT.md` y `AGENTS.md`.
```

---

# Flujo recomendado para los agentes

Estas skills deben acompañar aproximadamente este flujo diario:

```text
leer PROJECT.md + AGENTS.md
        ↓
frontend-architecture
        ↓
implementar módulo
        ↓
vercel-react-best-practices
        ↓
vercel-composition-patterns
        ↓
shadcn
        ↓
web-design-guidelines
        ↓
tests
        ↓
systematic-debugging (si existe un fallo)
        ↓
verification-before-completion
        ↓
done
```

Las skills externas ayudan al agente a tomar mejores decisiones, pero `PROJECT.md` y `AGENTS.md` son la fuente de verdad del scaffold.
