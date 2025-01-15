import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import RouteVersion from './config/route.config';
import userRoute from './v1/modules/store/routes/user.route';
import productRoute from './v1/modules/store/routes/product.route';

const app = express();

app
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(`/api/${RouteVersion.v1}`, userRoute)
  .use(`/api/${RouteVersion.v1}`, productRoute);

export default app;
