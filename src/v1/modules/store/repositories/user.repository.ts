import { Model } from 'mongoose';
import User, { IUser } from '../../../../database/models/User';

export class UserRepository {
  private userModel: Model<IUser>;

  constructor() {
    this.userModel = User;
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id);
  }

  async findByPhoneNumberOrEmail(phoneNumber: string, email: string): Promise<IUser | null> {
    return this.userModel.findOne({
      $or: [{ phone_number: phoneNumber }, { email }],
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return this.userModel.findOne({ phone_number: phoneNumber });
  }
}
