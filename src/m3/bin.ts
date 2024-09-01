#!/usr/bin/env node

import { resolve } from 'path';

import { importDirectory } from '../util/import.js';
import program from './program.js';

await importDirectory(resolve(import.meta.dirname, 'command'));

program.parse(process.argv);
