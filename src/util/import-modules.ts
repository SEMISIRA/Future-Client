// export async function * importStarGenerator (directory: string): AsyncGenerator<unknown> {
//   for await (const file of getAllFiles(directory)) {
//     yield await import(file)
//   }
// }

import { exists } from './file.js'
import { readdir } from 'fs/promises'
import { resolve } from 'path'

export async function * importModulesGenerator (directory: string, index: string): AsyncGenerator<unknown> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(entry.path, entry.name, index)

    if (!entry.isDirectory()) throw new Error(`Expected ${path} to be a directory`)

    if (!await exists(path)) continue

    yield await import(path)
  }
}

export async function importModules (directory: string, index: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _ of importModulesGenerator(directory, index));
}
