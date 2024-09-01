import chalk from 'chalk';
import { resolve } from 'path';

import { importModules } from '../util/import-modules.js';

const MODULES_DIR_PATH = resolve(import.meta.dirname, '../modules');

console.group('Loading modules... (local)');

const start = performance.now();

let moduleStart = NaN;

await importModules(MODULES_DIR_PATH, 'local.js', {
  pre(entry) {
    const module = entry.name;
    console.group(`Loading ${module}...`);

    const now = performance.now();
    moduleStart = now;
  },
  post(_entry) {
    const now = performance.now();
    const delta = now - moduleStart;

    console.groupEnd();
    console.info(`took ${delta.toFixed(2)}ms`);
  },
  error(error, entry) {
    const module = entry.name;

    error.stack += `\n    while loading module ${JSON.stringify(
      module,
    )} (local)`;

    console.error(chalk.red(error.stack));
  },
});

const end = performance.now();

const delta = end - start;

console.groupEnd();
console.info(`took ${delta.toFixed(2)}ms`);
