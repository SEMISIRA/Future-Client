import { importModules } from '../util/import-modules.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

if (!('require' in globalThis)) {
  globalThis.__filename = fileURLToPath(import.meta.url)
  globalThis.__dirname = dirname(__filename)
}

const MODULE_DIR_PATH = resolve(__dirname, '../module')

await importModules(MODULE_DIR_PATH, 'local.js')
