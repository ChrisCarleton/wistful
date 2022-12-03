import {
  defaultFormatting,
  formatting,
  logLevel,
  mdKey,
  mdValue,
} from './formatting';
import { Metadata, WinstonLogEntry } from './winston-log-entry';

export type WriteFunction = (str: string) => void;

export function maxKeyLength(metadata: Metadata) {
  if (Array.isArray(metadata)) {
    // for an array all keys are considered to be hyphens
    return 2;
  }

  const keys = Object.keys(metadata);
  let maxLength = 0;

  for (const key of keys) {
    maxLength = maxLength > key.length ? maxLength : key.length;
  }
  maxLength += 4;

  return maxLength;
}

export function formatMetadata(
  write: WriteFunction,
  metadata: Metadata,
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

  const maxLength = maxKeyLength(metadata);

  keys.forEach((key) => {
    const keyDisplayValue = Array.isArray(metadata) ? '-' : `"${key}":`;
    if (metadata[key] !== null && typeof metadata[key] === 'object') {
      write(`${' '.padEnd(indentation, ' ')}${mdKey(keyDisplayValue)}`);
      formatMetadata(
        write,
        metadata[key] as Record<string, unknown>,
        level + 1,
      );
    } else {
      write(
        `${' '.padEnd(indentation, ' ')}${mdKey(
          keyDisplayValue.padEnd(maxLength, ' '),
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
      logLevel(`[${parsed.level?.toUpperCase() ?? 'UNKNOWN'}]`.padEnd(10, ' ')),
      parsed.timestamp,
      parsed.message,
    ),
  );

  if (parsed.metadata && typeof parsed.metadata === 'object') {
    formatMetadata(write, parsed.metadata);
  } else {
    const metadata: Record<string, unknown> = Object.assign(
      {},
      parsed as unknown,
    );
    delete metadata.timestamp;
    delete metadata.level;
    delete metadata.message;

    formatMetadata(write, metadata);
  }
}
