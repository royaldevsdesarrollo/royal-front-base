// Wrapper de `shadcn add` que además regenera el barrel de ui/.
// Uso: pnpm ui:add <componente> [más componentes u opciones de la CLI]

import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error('Uso: pnpm ui:add <componente> [más componentes u opciones]')
  console.error('Ejemplo: pnpm ui:add badge button')
  process.exit(1)
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

// Binario local de shadcn (devDependency): versión fijada y sin descargas.
const add = spawnSync('pnpm', ['exec', 'shadcn', 'add', ...args], {
  cwd: rootDir,
  stdio: 'inherit',
})

if (add.status !== 0) {
  process.exit(add.status ?? 1)
}

const barrel = spawnSync('node', ['scripts/generate-ui-barrel.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
})

if (barrel.status !== 0) {
  process.exit(barrel.status ?? 1)
}

const lint = spawnSync('pnpm', ['exec', 'eslint', 'src/shared/components/ui', '--fix'], {
  cwd: rootDir,
  stdio: 'inherit',
})

process.exit(lint.status ?? 1)
