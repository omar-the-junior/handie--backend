import winston from 'winston';
const { format, createLogger, transports } = winston;
const { printf, combine, timestamp, colorize } = format;

const nodeEnv = process.env.NODE_ENV || 'development';

const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}: ${level}: ${stack || message}`;
});
export const logger = createLogger({
  level: nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    winstonFormat,
    colorize({ all: true, colors: { info: 'blue' } }),
  ),
  transports: [new transports.Console()],
});
