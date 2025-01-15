import { NextFunction, Request } from 'express';
import logger from './logger';

// Plugin to log request details in Express
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
};

// Example of logging errors
export const logError = (message: string) => {
  logger.error(message);
};

// Export other log types if needed
export const logInfo = (message: string) => {
  logger.info(message);
};
