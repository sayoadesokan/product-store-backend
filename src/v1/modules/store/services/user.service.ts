import { UserRepository } from '../repositories/user.repository';
import { LoginUserDTO, RegisterUserDTO } from '../dto/user.dto';
import AppError from '../../../../shared/error/app.error';
import { bcryptCompareHashedString, bcryptHashString } from '../../../../shared/utils/hash.utils';
import { generateToken } from '../../../../shared/utils/token.utils';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userDetails: RegisterUserDTO) {
    const userExist = await this.userRepository.findByPhoneNumberOrEmail(userDetails.phone_number, userDetails.email);

    if (userExist) throw new AppError(409, 'email or phone number already exists. Try logging in.');

    const hashedPassword = await bcryptHashString(userDetails.password);

    const newUser = await this.userRepository.createUser({ ...userDetails, password: hashedPassword });

    const token = generateToken(newUser.id);

    return { token };
  }

  async login(loginDetails: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(loginDetails.email);

    if (!user) throw new AppError(404, 'Invalid Username or Password');

    const isPasswordValid = await bcryptCompareHashedString(loginDetails.password, user.password);

    if (!isPasswordValid) throw new AppError(401, 'Invalid credentials');

    const token = generateToken(user.id);

    return { token };
  }
}
