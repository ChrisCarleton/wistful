import chalk, { Chalk } from 'chalk';

export const defaultFormatting = chalk.white.inverse;
export const ignoredLine = chalk.grey;

export const mdKey = chalk.blueBright.bold;
export const mdValue = chalk.greenBright.italic;

export const formatting: Record<string, Chalk> = {
  silly: chalk.grey,
  debug: chalk.white,
  verbose: chalk.white,
  http: chalk.white,
  info: chalk.whiteBright,
  warn: chalk.yellowBright,
  error: chalk.bold.redBright,
  default: defaultFormatting,
};
