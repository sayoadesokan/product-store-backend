import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  country_code: string;
  country: string;
}

const UserSchema: Schema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    country: { type: String, required: true },
    country_code: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
