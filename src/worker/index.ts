import chalk from 'chalk';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { importModules } from '../util/import-modules.js';

if (!('require' in globalThis)) {
  globalThis.__filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = dirname(__filename);
}

const MODULE_DIR_PATH = resolve(__dirname, '../module');

console.group('Loading modules... (local)');

const start = performance.now();

let moduleStart = NaN;

await importModules(MODULE_DIR_PATH, 'local.js', {
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
