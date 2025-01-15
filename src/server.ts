import bootstrap from './bootstrap';
import app from './app';
import logger from './shared/utils/logger/logger';
import appConfig from './config/app.config';

const PORT = appConfig.server.port || 3000;

bootstrap().then(() => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
});
