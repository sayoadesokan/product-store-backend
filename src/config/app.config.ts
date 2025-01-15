import { config } from 'dotenv';
import { getEnv } from './env.config';
config();

const appConfig = {
  app: {
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    env: getEnv(),
  },
  server: {
    port: Number(process.env.PORT),
  },
  db: {
    uri: String(process.env.MONGO_URI),
  },
  secret: {
    jwt: String(process.env.JWT_SECRET),
    reset: String(process.env.RESET_SECRET),
  },
};

export default appConfig;
