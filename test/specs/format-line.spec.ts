import { readFile, stat } from 'fs/promises';
import path from 'path';
import { Logger } from 'winston';

import { formatLine, maxKeyLength } from '../../src/format-line';
import { createLogger } from '../utils/create-logger';

let output = '';

function closeLogger(logger: Logger): Promise<void> {
  return new Promise((resolve) => {
    logger.once('close', () => {
      resolve();
    });
    logger.close();
  });
}

async function readLogFile(
  filename: string,
  createLog: (logger: Logger) => void,
): Promise<string> {
  const fqFilename = path.resolve(__dirname, '../fixtures/', filename);

  try {
    await stat(fqFilename);
  } catch (error) {
    expect((error as Record<string, unknown>).code).toEqual('ENOENT');
    const logger = createLogger(fqFilename);
    createLog(logger);
    await closeLogger(logger);
  }

  return readFile(fqFilename, { encoding: 'utf-8' });
}

function captureOutput(str: string) {
  output += `${str}\n`;
}

describe('Format line', () => {
  afterEach(() => {
    output = '';
  });

  it('Will throw an exception if JSON cannot be parsed', () => {
    expect(() => formatLine('This is not JSON', jest.fn())).toThrowError(
      SyntaxError,
    );
  });

  it('Will parse a simple log message', async () => {
    const expected = await readLogFile('simple-log-message.log', (logger) => {
      logger.debug('Just a simple log message');
    });

    formatLine(expected, captureOutput);
    expect(output).toMatchSnapshot();
  });

  it('Will format simple metadata object', async () => {
    const expected = await readLogFile('simple-metadata.log', (logger) => {
      logger.warn('This should log metadata', {
        username: 'mike',
        age: 28,
        timestamp: '2022-11-22T13:51:23.730Z',
        isAwesome: true,
      });
    });

    formatLine(expected, captureOutput);
    expect(output).toMatchSnapshot();
  });

  it('Will format metadata with nested objects', async () => {
    const expected = await readLogFile('nested-metadata.log', (logger) => {
      logger.http('Trying with some nested stuff', {
        metadata: {
          name: {
            firstName: 'Gordon',
            lastName: 'Bowers',
          },
          email: 'gbowers23234@gmail.com',
          profile: {
            settings: {
              volume: 70,
              darkMode: true,
            },
            tagLine: 'This is a tag line',
          },
        },
      });
    });

    formatLine(expected, captureOutput);
    expect(output).toMatchSnapshot();
  });

  // TODO: Get arrays working properly.
  it('Will format arrays correctly', async () => {
    const expected = await readLogFile('simple-array.log', (logger) => {
      logger.error('Parse this array', {
        arr: ['alpha', 'bravo', 'charlie'],
      });
    });

    formatLine(expected, captureOutput);
    expect(output).toMatchSnapshot();
  });
});

describe('Max Key Length', () => {
  it('Will return the correct length when the metadata is an array', () => {
    const maxLength = maxKeyLength([33, 66, 88, 99]);
    expect(maxLength).toBeCloseTo(2, 3);
  });

  it('Will return the correct length when the metadata is an array', () => {
    const metadata = {
      shortKey: 99,
      longKeyLongKeyLongKey: { interestingStuff: 99, boringStuff: 1 },
    };
    const maxLength = maxKeyLength(metadata);
    expect(maxLength).toBeCloseTo(25, 3);
  });
});
