import chalk from 'chalk';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

import { createTable } from '../../util/table.js';
import { Module } from '../module.js';
import program, { modulesDir } from '../program.js';

program
  .command('list')
  .description('List installed modules')
  .action(async () => {
    const tableData: Record<string, string>[] = [];

    for (const entry of await readdir(modulesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      try {
        const modulePath = resolve(modulesDir, entry.name);
        const module = await Module.fromDir(modulePath);

        tableData.push({
          [chalk.bold('Name')]: module.global.name,
          [chalk.bold('Dependency?')]: module.local.manual ? 'no' : 'yes',
        });
      } catch (error) {
        console.error(error);
      }
    }

    console.info(createTable(tableData));
  });
