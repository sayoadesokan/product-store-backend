import { IProduct } from '../../../../../database/models/Product';
import { IUser } from '../../../../../database/models/User';
import AppError from '../../../../../shared/error/app.error';
import { ProductDTO } from '../../../store/dto/product.dto';
import { ProductRepository } from '../../../store/repositories/product.repository';
import { UserRepository } from '../../../store/repositories/user.repository';
import { ProductService } from '../../../store/services/product.service';

jest.mock('../../../store/repositories/user.repository');
jest.mock('../../../store/repositories/product.repository');

describe('ProductService', () => {
  let productService: ProductService;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let productRepositoryMock: jest.Mocked<ProductRepository>;

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

  const mockProduct = {
    _id: 'product123',
    name: 'T-shirt',
    price: 12089,
    description: 'nice trousers',
    stock: 212,
    user: mockUser._id,
  } as unknown as IProduct;

  const productDetails: ProductDTO = {
    name: 'T-shirt',
    price: 12089,
    description: 'nice trousers',
    stock: 212,
  };

  beforeEach(() => {
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    productRepositoryMock = new ProductRepository() as jest.Mocked<ProductRepository>;
    productService = new ProductService();
  });

  describe('create', () => {
    it('should throw an error if user not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(productService.create(productDetails, 'user-id')).rejects.toThrow(
        new AppError(404, 'User not found.'),
      );
    });

    it('should create a product successfully', async () => {
      userRepositoryMock.findById.mockResolvedValue(mockUser);
      productRepositoryMock.createProduct.mockResolvedValue(mockProduct);

      const result = await productService.create(productDetails, 'user123');

      expect(result).toEqual(mockProduct);
      expect(productRepositoryMock.createProduct).toHaveBeenCalledWith({
        ...productDetails,
        user: mockUser._id,
      });
    });

    it('should throw an error if product creation fails', async () => {
      userRepositoryMock.findById.mockResolvedValue(mockUser);
      //   productRepositoryMock.createProduct.mockResolvedValue(null);

      await expect(productService.create(productDetails, 'user123')).rejects.toThrow(
        new AppError(500, 'Failed to create product.'),
      );
    });
  });

  describe('edit', () => {
    it('should throw an error if product not found', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(null);

      await expect(productService.edit('product-id', productDetails)).rejects.toThrow(
        new AppError(404, 'Product not found.'),
      );
    });

    it('should update a product successfully', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(mockProduct);
      productRepositoryMock.updateProduct.mockResolvedValue(mockProduct);

      const result = await productService.edit('product123', productDetails);

      expect(result).toEqual(mockProduct);
      expect(productRepositoryMock.updateProduct).toHaveBeenCalledWith(mockProduct._id, productDetails);
    });

    it('should throw an error if product update fails', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(mockProduct);
      productRepositoryMock.updateProduct.mockResolvedValue(null);

      await expect(productService.edit('product123', productDetails)).rejects.toThrow(
        new AppError(500, 'Failed to update product.'),
      );
    });
  });

  describe('fetchProduct', () => {
    it('should throw an error if product not found', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(null);

      await expect(productService.fetchProduct('product-id')).rejects.toThrow(new AppError(404, 'Product not found.'));
    });

    it('should fetch a product successfully', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(mockProduct);

      const result = await productService.fetchProduct('product123');

      expect(result).toEqual(mockProduct);
    });
  });

  describe('fetchUserProducts', () => {
    it('should throw an error if user not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(productService.fetchUserProducts('user-id')).rejects.toThrow(new AppError(404, 'User not found.'));
    });

    it('should throw an error if no products found for user', async () => {
      userRepositoryMock.findById.mockResolvedValue(mockUser);
      productRepositoryMock.findProductsByUserId.mockResolvedValue([]);

      await expect(productService.fetchUserProducts('user123')).rejects.toThrow(
        new AppError(404, 'No products found for this user.'),
      );
    });
  });

  describe('deleteProducts', () => {
    it('should throw an error if product not found', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(null);

      await expect(productService.deleteProducts('product-id')).rejects.toThrow(
        new AppError(404, 'Product not found.'),
      );
    });

    it('should delete a product successfully', async () => {
      productRepositoryMock.findProductById.mockResolvedValue(mockProduct);
      productRepositoryMock.deleteProduct.mockResolvedValue(mockProduct);

      const result = await productService.deleteProducts('product123');

      expect(result).toEqual(mockProduct);
      expect(productRepositoryMock.deleteProduct).toHaveBeenCalledWith('product123');
    });
  });
});
