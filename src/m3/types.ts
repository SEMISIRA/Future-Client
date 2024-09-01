// Module directory structure
// <implementation>
//  ├─ [local.ts]     TypeScript
//  ├─ [global.ts]    TypeScript
//  ├─ m3.local.json  JSON(LocalModuleData)
//  ├─ m3.global.json JSON(GlobalModuleData)
//  └─ ...

import { z } from 'zod';

export const LocalModuleDataSchema = z.object({
  // manual -> required by the user
  // auto -> a dependency to another module
  manual: z.boolean(),
});

export type LocalModuleData = z.infer<typeof LocalModuleDataSchema>;

export const GlobalModuleDataSchema = z.object({
  dependencies: z.array(z.string().url()),
  // * This is different from package.json's name as it is required to be the same as the directory's
  name: z.string(),
});

export type GlobalModuleData = z.infer<typeof GlobalModuleDataSchema>;
