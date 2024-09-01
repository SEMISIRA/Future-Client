import { readFile } from 'fs/promises';
import { resolve } from 'path';

import type { GlobalModuleData, LocalModuleData } from './types.js';
import { GlobalModuleDataSchema, LocalModuleDataSchema } from './types.js';

async function getLocalData(path: string): Promise<LocalModuleData> {
  try {
    const raw = await readFile(path, 'utf8');
    const data = JSON.parse(raw) as unknown;

    return LocalModuleDataSchema.parse(data);
  } catch (error) {
    throw new Error(`Could not load local module data: ${error}`);
  }
}

async function getGlobalData(path: string): Promise<GlobalModuleData> {
  try {
    const raw = await readFile(path, 'utf8');
    const data = JSON.parse(raw) as unknown;

    return GlobalModuleDataSchema.parse(data);
  } catch (error) {
    throw new Error(`Could not load global module data: ${error}`);
  }
}

export class Module {
  public static async fromDir(path: string): Promise<Module> {
    const localPath = resolve(path, 'm3.local.json');
    const globalPath = resolve(path, 'm3.global.json');

    return new Module(
      await getLocalData(localPath),
      await getGlobalData(globalPath),
    );
  }

  constructor(
    public readonly local: LocalModuleData,
    public readonly global: GlobalModuleData,
  ) {}
}
