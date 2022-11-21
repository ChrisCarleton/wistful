#!/usr/bin/env node
/* eslint-disable no-console */
import readline from 'readline';

import { formatLine } from './format-line';
import { ignoredLine } from './formatting';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  try {
    formatLine(line, (...outputArgs) => {
      console.log(...outputArgs);
    });
  } catch {
    console.log(ignoredLine(line));
  }
});

rl.once('close', () => {
  /* Anything to go here? */
});
