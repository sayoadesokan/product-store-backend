import { initializeCustomValidators } from './config/validator.config';
import dbConnection from './database';
import logger from './shared/utils/logger/logger';

const bootstrap = async () => {
  try {
    await dbConnection();
    logger.info('Database connected successfully.');
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

// Initialize custom validators
const initializeValidators = () => {
  initializeCustomValidators();
  logger.info('Custom validators initialized successfully');
};

export default async () => {
  await bootstrap();
  initializeValidators();
};
