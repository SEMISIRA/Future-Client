import { readdir } from 'fs/promises';
import { resolve } from 'path';

export async function importDirectory(path: string): Promise<void> {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (!entry.isFile()) continue;

    await import(resolve(path, entry.name));
  }
}
