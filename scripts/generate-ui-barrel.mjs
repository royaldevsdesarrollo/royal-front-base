// Regenera el barrel de src/shared/components/ui/index.ts.
// Escanea los archivos .tsx de la carpeta y emite `export * from './<nombre>'`
// ordenados alfabéticamente. Se ejecuta solo con `pnpm ui:barrel` y también
// al final de `pnpm ui:add`.

import { readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const uiDir = join(dirname(fileURLToPath(import.meta.url)), '../src/shared/components/ui')
const barrelPath = join(uiDir, 'index.ts')

const modules = readdirSync(uiDir, { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
  .map(entry => entry.name.replace(/\.tsx$/, ''))
  .sort((a, b) => a.localeCompare(b))

const header = `// ARCHIVO GENERADO — no editar a mano.
// Se regenera con \`pnpm ui:barrel\` o automáticamente tras \`pnpm ui:add <componente>\`.
`

const body
  = modules.length > 0
    ? modules.map(name => `export * from './${name}'`).join('\n') + '\n'
    : '// Aún no hay componentes UI. Agrega uno con: pnpm ui:add <componente>\n'

writeFileSync(barrelPath, header + '\n' + body)

console.log(`Barrel de UI regenerado (${modules.length} componente(s)): ${barrelPath}`)
