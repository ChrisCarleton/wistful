#!/usr/bin/env node
import readline from 'readline';

import { ignoredLine } from './formatting';
import { formatLine } from './format-line';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  try {
    formatLine(line);
  } catch {
    console.log(ignoredLine(line));
  }
});

rl.once('close', () => {
  /* Anything to go here? */
});
