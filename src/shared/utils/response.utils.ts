import ObjectLiteral from '../types/object-literal.type';

export const SuccessResponse = (message: string, data?: ObjectLiteral, meta?: ObjectLiteral) => {
  return {
    status: true,
    message,
    data,
    meta,
  };
};

export const ErrorResponse = (message: string, errors?: any[], errorCode?: string) => {
  return {
    status: false,
    message,
    errorCode,
    errors,
  };
};
