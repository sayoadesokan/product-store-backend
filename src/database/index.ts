import mongoose from 'mongoose';
import logger from '../shared/utils/logger/logger';
import appConfig from '../config/app.config';

let url: string = appConfig.db.uri;

const dbConnection = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log('could not connect to db');
    logger.error('Could not connect to db!');
  }
};

export default dbConnection;
