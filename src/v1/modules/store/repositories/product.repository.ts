import { Model } from 'mongoose';
import Product, { IProduct } from '../../../../database/models/Product';

export class ProductRepository {
  private productModel: Model<IProduct> = Product;

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const product = new this.productModel(data);
    return product.save();
  }

  async findAllProducts(): Promise<IProduct[]> {
    return this.productModel.find();
  }

  async findProductById(productId: string): Promise<IProduct | null> {
    return this.productModel.findById(productId);
  }

  async updateProduct(productId: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return this.productModel.findByIdAndUpdate(productId, data, { new: true });
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    return this.productModel.findByIdAndDelete(productId);
  }

  async findProductsByUserId(userId: string): Promise<IProduct[]> {
    return this.productModel.find({ user: userId });
  }
}
