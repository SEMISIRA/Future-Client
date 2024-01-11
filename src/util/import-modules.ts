// export async function * importStarGenerator (directory: string): AsyncGenerator<unknown> {
//   for await (const file of getAllFiles(directory)) {
//     yield await import(file)
//   }
// }

import { exists } from './file.js'
import { type AsyncVoid } from './types.js'
import { type Dirent } from 'fs'
import { readdir } from 'fs/promises'
import { resolve } from 'path'

export interface Callbacks {
  pre?: (entry: Dirent) => AsyncVoid
  post?: (entry: Dirent) => AsyncVoid
  error?: (error: Error, entry: Dirent) => AsyncVoid
}

export async function * importModulesGenerator (directory: string, index: string, callbacks?: Callbacks): AsyncGenerator<unknown> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(entry.path, entry.name, index)

    if (!entry.isDirectory()) console.warn(`Expected ${entry.name} to be a directory (located at ${entry.path})`)

    if (!await exists(path)) continue

    try {
      const preCallback = callbacks?.pre

      if (preCallback !== undefined) await preCallback(entry)

      yield await import(path)

      const postCallback = callbacks?.post

      if (postCallback !== undefined) await postCallback(entry)
    } catch (error) {
      const errorCallback = callbacks?.error

      if (errorCallback === undefined) throw error

      await errorCallback(error as Error, entry)
    }
  }
}

export async function importModules (directory: string, index: string, callbacks?: Callbacks): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _ of importModulesGenerator(directory, index, callbacks));
}
