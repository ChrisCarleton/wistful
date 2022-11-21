import chalk from 'chalk';

import { defaultFormatting, formatting, mdKey, mdValue } from './formatting';
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
  for (const key of keys) {
    maxLength = maxLength > key.length ? maxLength : key.length;
  }
  maxLength += 3;

  if (Array.isArray(metadata)) {
    maxLength = 1;
  }

  keys.forEach((key) => {
    const keyDisplayValue = Array.isArray(metadata) ? '-' : `"${key}":`;

    if (metadata[key] !== null && typeof metadata[key] === 'object') {
      console.log(
        ' '.padEnd(indentation, ' '),
        chalk.white.bold(keyDisplayValue),
      );
      formatMetadata(metadata[key] as Record<string, unknown>, level + 1);
    } else {
      console.log(
        ' '.padEnd(indentation, ' '),
        mdKey(keyDisplayValue.padEnd(maxLength, ' ')),
        mdValue(`${JSON.stringify(metadata[key])}`),
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
