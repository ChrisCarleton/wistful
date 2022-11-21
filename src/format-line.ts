import chalk from 'chalk';

import { defaultFormatting, formatting, mdKey, mdValue } from './formatting';
import { WinstonLogEntry } from './winston-log-entry';

export type WriteFunction = (str: string) => void;

export function formatMetadata(
  write: WriteFunction,
  metadata: Record<string, unknown>,
  level = 0,
) {
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
  maxLength += 4;

  keys.forEach((key) => {
    if (typeof metadata[key] === 'object') {
      write(`${' '.padEnd(indentation, ' ')} ${chalk.white.bold(`"${key}":`)}`);
      formatMetadata(
        write,
        metadata[key] as Record<string, unknown>,
        level + 1,
      );
    } else {
      write(
        `${' '.padEnd(indentation, ' ')}${mdKey(
          `"${key}":`.padEnd(maxLength, ' '),
        )}${mdValue(`${JSON.stringify(metadata[key])}`)}`,
      );
    }
  });

  if (!level) {
    write('');
  }
}

export function formatLine(line: string, write: WriteFunction) {
  const parsed: WinstonLogEntry = JSON.parse(line);
  const format = formatting[parsed.level ?? 'default'] ?? defaultFormatting;

  write(
    format(
      chalk.bold(
        `[${parsed.level?.toUpperCase() ?? 'UNKNOWN'}]`.padEnd(10, ' '),
      ),
      `${parsed.message}`,
    ),
  );
  formatMetadata(write, parsed.metadata);
}
