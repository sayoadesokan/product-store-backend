import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../../../app';
import Product from '../../../../../database/models/Product';
import User from '../../../../../database/models/User';
import mongoose from 'mongoose';
import { bcryptHashString } from '../../../../../shared/utils/hash.utils';
import 'dotenv';

describe('ProductController', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);

    const user = new User({
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      phone_number: '1234567890',
      password: await bcryptHashString('Password@123'),
      country: 'Nigeria',
      country_code: '+234',
    });
    const savedUser = await user.save();
    userId = savedUser.id;

    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  describe('POST /api/v1/product', () => {
    it('should create a new product', async () => {
      const productPayload = {
        name: 'T-shirt',
        price: 12089,
        description: 'nice trousers',
        stock: 212,
      };

      const response = await request(app)
        .post('/api/v1/product')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productPayload)
        .expect(201);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Product Created Successfully',
        data: {
          name: productPayload.name,
          price: productPayload.price,
          description: productPayload.description,
          stock: productPayload.stock,
        },
      });

      const product = await Product.findOne({ name: productPayload.name });
      expect(product).not.toBeNull();
      expect(product?.user.toString()).toBe(userId);
    });
  });

  describe('PATCH /api/v1/product/:id', () => {
    it('should edit an existing product', async () => {
      const product = new Product({
        name: 'Shirt',
        price: 5000,
        description: 'A comfortable shirt',
        stock: 100,
        user: userId,
      });
      const savedProduct = await product.save();

      const updatePayload = {
        name: 'Updated Shirt',
        price: 5500,
        description: 'An updated comfortable shirt',
        stock: 90,
      };

      const response = await request(app)
        .patch(`/api/v1/product/${savedProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatePayload)
        .expect(200);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Product Edited Successfully',
        data: {
          name: updatePayload.name,
          price: updatePayload.price,
          description: updatePayload.description,
          stock: updatePayload.stock,
        },
      });

      const updatedProduct = await Product.findById(savedProduct.id);
      expect(updatedProduct?.name).toBe(updatePayload.name);
    });
  });

  describe('GET /api/v1/product/:id', () => {
    it('should fetch a product by ID', async () => {
      const product = new Product({
        name: 'Shoes',
        price: 3000,
        description: 'Comfortable running shoes',
        stock: 50,
        user: userId,
      });
      const savedProduct = await product.save();

      const response = await request(app)
        .get(`/api/v1/product/${savedProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Product Retrieved Successfully',
        data: {
          name: savedProduct.name,
          price: savedProduct.price,
          description: savedProduct.description,
          stock: savedProduct.stock,
        },
      });
    });
  });

  describe('GET /api/v1/products', () => {
    it('should fetch all products for a user', async () => {
      const product1 = new Product({
        name: 'Laptop',
        price: 200000,
        description: 'A high-end laptop',
        stock: 10,
        user: userId,
      });
      const product2 = new Product({
        name: 'Headphones',
        price: 15000,
        description: 'Noise-canceling headphones',
        stock: 30,
        user: userId,
      });
      await product1.save();
      await product2.save();

      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Products Retrieved Successfully',
        data: expect.any(Array),
      });

      expect(response.body.data.length).toBe(2);
    });
  });

  describe('DELETE /api/v1/product/:id', () => {
    it('should delete a product by ID', async () => {
      const product = new Product({
        name: 'Tablet',
        price: 50000,
        description: 'A lightweight tablet',
        stock: 15,
        user: userId,
      });
      const savedProduct = await product.save();

      const response = await request(app)
        .delete(`/api/v1/product/${savedProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: true,
        message: 'Product Deleted Successfully',
      });

      const deletedProduct = await Product.findById(savedProduct.id);
      expect(deletedProduct).toBeNull();
    });
  });
});
