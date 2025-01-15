import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'; // Correct import

// Define log format
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Configure logger
const logger = createLogger({
  format: combine(
    colorize(), // Colorize logs for development
    timestamp(), // Add timestamps
    logFormat // Apply custom format
  ),
  transports: [
    // Log to console
    new transports.Console({
      format: combine(
        colorize(),
        logFormat // Apply custom format to console logs as well
      ),
    }),

    // Log to file (daily rotation)
    new DailyRotateFile({
      // Use DailyRotateFile directly
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat, // Apply custom format to file logs
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Log uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new transports.File({
    filename: 'logs/exceptions.log',
    format: logFormat, // Apply custom format to exception logs
  })
);

logger.rejections.handle(
  new transports.File({
    filename: 'logs/rejections.log',
    format: logFormat, // Apply custom format to rejection logs
  })
);

export default logger;
