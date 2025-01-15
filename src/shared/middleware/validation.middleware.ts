import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

export function validateRequest(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(dtoClass, req.body);

    const errors = await validate(dto);

    if (errors.length > 0) {
      // Return validation errors with a 400 response
      res.status(400).json({ success: false, errors });
      return;
    }

    // Proceed to the next middleware if no validation errors
    next();
  };
}
