import {
  createLogger as createWinstonLogger,
  format,
  Logger,
  transports,
} from 'winston';

const formatConfig = format.combine(
  format.json(),
  format.errors({ stack: true }),
  format.metadata(),
);

export function createLogger(filename: string): Logger {
  return createWinstonLogger({
    level: 'silly',
    format: formatConfig,
    transports: [
      new transports.File({
        filename,
      }),
    ],
  });
}
