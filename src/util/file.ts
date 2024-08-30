import fs, { access, constants } from 'fs/promises';
import { resolve } from 'path';

export async function* getAllFiles(dir: string): AsyncIterable<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      yield* getAllFiles(res);
    } else {
      yield res;
    }
  }
}

export async function exists(path: string): Promise<boolean> {
  return await access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
