import { RegisterUserDTO, LoginUserDTO } from '../../../store/dto/user.dto';
import { generateToken } from '../../../../../shared/utils/token.utils';
import { bcryptCompareHashedString, bcryptHashString } from '../../../../../shared/utils/hash.utils';
import { UserRepository } from '../../../store/repositories/user.repository';
import { UserService } from '../../../store/services/user.service';
import AppError from '../../../../../shared/error/app.error';
import { IUser } from '../../../../../database/models/User';

jest.mock('../../../store/repositories/user.repository');
jest.mock('../../../../../shared/utils/hash.utils');
jest.mock('../../../../../shared/utils/token.utils');

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  const mockUser = {
    _id: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@gmail.com',
    password: 'hashedPassword123',
    phone_number: '9034462164',
    country: 'Nigeria',
    country_code: '+234',
  } as unknown as IUser;

  beforeEach(() => {
    userService = new UserService();
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    (userService as any).userRepository = userRepositoryMock;
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      const userDetails: RegisterUserDTO = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'SecurePassword@123!',
        phone_number: '9034462164',
        country_code: '+234',
        country: 'Nigeria',
      };

      userRepositoryMock.findByPhoneNumberOrEmail.mockResolvedValue(null);
      (bcryptHashString as jest.Mock).mockResolvedValue('hashedPassword123');
      userRepositoryMock.createUser.mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('testToken');

      const result = await userService.register(userDetails);

      expect(userRepositoryMock.findByPhoneNumberOrEmail).toHaveBeenCalledWith(
        userDetails.phone_number,
        userDetails.email,
      );
      expect(bcryptHashString).toHaveBeenCalledWith(userDetails.password);
      expect(userRepositoryMock.createUser).toHaveBeenCalledWith({
        ...userDetails,
        password: 'hashedPassword123',
      });
      expect(generateToken);
      expect(result).toEqual({ token: 'testToken' });
    });

    it('should throw an error if user already exists', async () => {
      userRepositoryMock.findByPhoneNumberOrEmail.mockResolvedValue(mockUser);

      await expect(userService.register(mockUser as RegisterUserDTO)).rejects.toThrow(AppError);
      await expect(userService.register(mockUser as RegisterUserDTO)).rejects.toThrow(
        'email or phone number already exists. Try logging in.',
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const loginDetails: LoginUserDTO = {
        email: 'johndoe@gmail.com',
        password: 'SecurePassword@123!',
      };

      userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
      (bcryptCompareHashedString as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('testToken');

      const result = await userService.login(loginDetails);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(loginDetails.email);
      expect(bcryptCompareHashedString).toHaveBeenCalledWith(loginDetails.password, mockUser.password);
      expect(generateToken);
      expect(result).toEqual({ token: 'testToken' });
    });

    it('should throw an error if user is not found', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);

      await expect(userService.login({ email: 'invalid@gmail.com', password: 'password123' })).rejects.toThrow(
        AppError,
      );
      await expect(userService.login({ email: 'invalid@gmail.com', password: 'password123' })).rejects.toThrow(
        'Invalid Username or Password',
      );
    });

    it('should throw an error if password is invalid', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
      (bcryptCompareHashedString as jest.Mock).mockResolvedValue(false);

      await expect(userService.login({ email: mockUser.email, password: 'wrongPassword' })).rejects.toThrow(AppError);
      await expect(userService.login({ email: mockUser.email, password: 'wrongPassword' })).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
