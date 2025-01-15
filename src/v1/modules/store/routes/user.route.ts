import { Router } from 'express';
import { validateRequest } from '../../../../shared/middleware/validation.middleware';
import { LoginUserDTO, RegisterUserDTO } from '../dto/user.dto';
import { UserController } from '../controller/user.controller';

const userController = new UserController();
const userRoute = Router();

userRoute.post('/auth/register', validateRequest(RegisterUserDTO), userController.register.bind(userController));
userRoute.post('/auth/login', validateRequest(LoginUserDTO), userController.login.bind(userController));

export default userRoute;
