import { Command } from 'commander';
import { basename, resolve } from 'path';

const program = new Command();
export default program;

program.name('m3').description('MMP Module Manager');

// #region This doesn't look like it belongs here...

// Should always be set
export let modulesDir: string;

// If cwd is a module,
// cwd will be {modulesDir}/{moduleDir}
export let moduleDir: string | undefined;

const cwd = process.cwd();
const cwdn = basename(cwd);

const parent = resolve('..');

// are we in a module?
// (parent is modules dir)
if (basename(parent) === 'modules') {
  modulesDir = parent;
  moduleDir = cwdn;
} else {
  switch (cwdn) {
    case 'modular-minecraft-proxy':
      modulesDir = resolve('src/modules');
      break;
    case 'src':
      modulesDir = resolve('modules');
      break;
    case 'modules':
      modulesDir = resolve('.');
      break;
  }
}

// @ts-expect-error We are testing if modulesDir *hasn't* been set here
if (modulesDir === undefined) {
  throw new Error('Could not locate modules directory');
}

// #endregion
