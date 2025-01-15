import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger/logger';
import { ErrorResponse } from '../utils/response.utils';
import appConfig from '../../config/app.config';

interface UserPayload {
  id: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Access denied. No token provided!');
    return res.status(401).send(ErrorResponse('Access denied. No token provided!'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, appConfig.secret.jwt as string) as UserPayload;
    (req as any).user = decoded;

    logger.info(`User ${decoded.id} authenticated successfully.`);
    return next();
  } catch (error) {
    logger.error(`Invalid token: ${error instanceof Error ? error.message : error}`);
    return res.status(400).send(ErrorResponse('Invalid Token.'));
  }
};
