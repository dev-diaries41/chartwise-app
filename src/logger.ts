import { createLogger, format, transports } from 'winston';

const commonTransports = [
  new transports.Console(),
  new transports.File({
    filename: './logs/error.log',
    level: 'error',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
  }),
];

const combinedTransport = new transports.File({
  filename: './logs/combined.log',
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

const jobstransporter = new transports.File({
  filename: './logs/job.log',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.metadata(),
    format.json()
  ),
});


const metricstransporter = new transports.File({
  filename: './logs/metrics.log',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.metadata(),
    format.json()
  ),
});

export const logger = createLogger({
  transports: [...commonTransports, combinedTransport],
});

export const jobLogger = createLogger({
  transports: [...commonTransports, jobstransporter],
});


export const metricsLogger = createLogger({
  transports: [...commonTransports, metricstransporter],
});


