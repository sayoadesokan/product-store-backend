import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../../../app';
import User from '../../../../../database/models/User';
import mongoose from 'mongoose';
import { bcryptHashString } from '../../../../../shared/utils/hash.utils';
import 'dotenv';

describe('UserController', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return a JWT token', async () => {
      const userPayload = {
        first_name: 'John',
        last_name: 'Mike',
        email: 'mike@test.com',
        phone_number: '1234567890',
        password: 'Password@123',
        country: 'Nigeria',
        country_code: '+234',
      };

      const response = await request(app).post('/api/v1/auth/register').send(userPayload).expect(201);

      expect(response.body).toMatchObject({
        status: true,
        message: 'User Registered Successfully',
        data: {
          token: expect.any(String),
        },
      });

      const decoded = jwt.verify(response.body.data.token, process.env.JWT_SECRET as string);

      const user = await User.findOne({ email: userPayload.email });
      expect(user).not.toBeNull();

      expect(decoded).toHaveProperty('id', user?.id.toString());

      expect(user?.password).not.toBe(userPayload.password);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login an existing user and return a JWT token', async () => {
      const newUser = new User({
        first_name: 'John',
        last_name: 'Mike',
        email: 'mike@test.com',
        phone_number: '1234567890',
        password: await bcryptHashString('Password@123'),
        country: 'Nigeria',
        country_code: '+234',
      });
      await newUser.save();

      const loginPayload = {
        email: 'mike@test.com',
        password: 'Password@123',
      };

      const response = await request(app).post('/api/v1/auth/login').send(loginPayload).expect(200);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Logged in Successful',
        data: {
          token: expect.any(String),
        },
      });

      const decoded = jwt.verify(response.body.data.token, process.env.JWT_SECRET as string);

      expect(decoded).toHaveProperty('id', newUser.id.toString());
    });

    it('should fail login for incorrect credentials', async () => {
      const newUser = new User({
        first_name: 'John',
        last_name: 'Mike',
        email: 'mike@test.com',
        phone_number: '1234567890',
        password: await bcryptHashString('Password@123'),
        country: 'Nigeria',
        country_code: '+234',
      });
      await newUser.save();

      const loginPayload = {
        email: 'mike@test.com',
        password: 'WrongPassword123',
      };

      const response = await request(app).post('/api/v1/auth/login').send(loginPayload).expect(401);

      expect(response.body).toMatchObject({
        status: false,
        message: 'Invalid credentials',
      });
    });
  });
});
