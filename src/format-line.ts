import chalk from 'chalk';

import { defaultFormatting, formatting } from './formatting';
import { WinstonLogEntry } from './winston-log-entry';

export function formatMetadata(metadata: Record<string, unknown>, level = 0) {
  if (!metadata) {
    return;
  }

  const keys = Object.keys(metadata);
  const indentation = level * 2 + 4;
  if (!keys.length) {
    return;
  }

  let maxLength = 0;
  for (const key in keys) {
    maxLength = maxLength > key.length ? maxLength : key.length;
  }

  keys.forEach((key) => {
    if (typeof metadata[key] === 'object') {
      console.log(' '.padEnd(indentation, ' '), chalk.white.bold(`"${key}":`));
      formatMetadata(metadata[key] as Record<string, unknown>, level + 1);
    } else {
      console.log(
        ' '.padEnd(indentation, ' '),
        chalk.white.bold(`"${key}":`),
        chalk.italic(`${JSON.stringify(metadata[key])}`),
      );
    }
  });

  if (!level) {
    console.log();
  }
}

export function formatLine(line: string) {
  const parsed: WinstonLogEntry = JSON.parse(line);
  const format = formatting[parsed.level ?? 'default'] ?? defaultFormatting;

  console.log(
    format(
      chalk.bold(
        `[${parsed.level?.toUpperCase() ?? 'UNKNOWN'}]`.padEnd(10, ' '),
      ),
      `${parsed.message}`,
    ),
  );
  formatMetadata(parsed.metadata);
}
