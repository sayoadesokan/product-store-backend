import { Request, Response } from 'express';
import logger from '../../../../shared/utils/logger/logger';
import { ErrorResponse, SuccessResponse } from '../../../../shared/utils/response.utils';
import AppError from '../../../../shared/error/app.error';
import { LoginUserDTO, RegisterUserDTO } from '../dto/user.dto';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<any> {
    try {
      const userDetails = req.body as RegisterUserDTO;
      const result = await this.userService.register(userDetails);
      return res.status(201).send(SuccessResponse('User Registered Successfully', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    try {
      const loginDetails = req.body as LoginUserDTO;
      const result = await this.userService.login(loginDetails);
      return res.status(200).send(SuccessResponse('Logged in Successful', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }
}
