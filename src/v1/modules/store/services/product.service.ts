import { ProductDTO } from '../dto/product.dto';
import AppError from '../../../../shared/error/app.error';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';

export class ProductService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
  }

  async create(productDetails: ProductDTO, user_id: string) {
    const user = await this.userRepository.findById(user_id);
    if (!user) throw new AppError(404, 'User not found.');

    const newProduct = await this.productRepository.createProduct({ ...productDetails, user: user.id });
    if (!newProduct) throw new AppError(500, 'Failed to create product.');

    return newProduct;
  }

  async edit(id: string, productDetails: ProductDTO) {
    const product = await this.productRepository.findProductById(id);
    if (!product) throw new AppError(404, 'Product not found.');

    const updatedProduct = await this.productRepository.updateProduct(product.id, productDetails);
    if (!updatedProduct) throw new AppError(500, 'Failed to update product.');

    return updatedProduct;
  }

  async fetchProduct(id: string) {
    const product = await this.productRepository.findProductById(id);
    if (!product) throw new AppError(404, 'Product not found.');
    return product;
  }

  async fetchUserProducts(user_id: string) {
    const user = await this.userRepository.findById(user_id);
    if (!user) throw new AppError(404, 'User not found.');

    const products = await this.productRepository.findProductsByUserId(user.id);
    if (!products.length) throw new AppError(404, 'No products found for this user.');
    return products;
  }

  async deleteProducts(id: string) {
    const product = await this.productRepository.findProductById(id);
    if (!product) throw new AppError(404, 'Product not found.');

    return this.productRepository.deleteProduct(id);
  }
}
