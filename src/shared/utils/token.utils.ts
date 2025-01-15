import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import appConfig from '../../config/app.config';

export const generateToken = (id: string | number, expiresIn: string | number = '24h'): string => {
  if (!expiresIn) {
    return jwt.sign({ id }, appConfig.secret.jwt);
  }
  return jwt.sign({ id }, appConfig.secret.jwt, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, appConfig.secret.jwt);
};

export const resetToken = (email: string, expiresIn?: string | number): string => {
  const options: SignOptions = expiresIn ? { expiresIn: '10m' } : {};
  return jwt.sign({ email }, appConfig.secret.reset, options);
};

export const verifyResetToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, appConfig.secret.reset);
};

export const generateRandomToken = () => {
  const randomNum = Math.floor(Math.random() * 900000) + 100000;
  return randomNum;
};
