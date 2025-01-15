import { Router } from 'express';
import { authMiddleware } from '../../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../../shared/middleware/validation.middleware';
import { ProductDTO } from '../dto/product.dto';
import { ProductController } from '../controller/product.controller';

const productController = new ProductController();
const productRoute = Router();

productRoute.post(
  '/product',
  validateRequest(ProductDTO),
  authMiddleware,
  productController.createProduct.bind(productController),
);
productRoute.patch(
  '/product/:id',
  validateRequest(ProductDTO),
  authMiddleware,
  productController.editProduct.bind(productController),
);
productRoute.get('/product/:id', authMiddleware, productController.fetchProductById.bind(productController));
productRoute.get('/products', authMiddleware, productController.fetchUsersProducts.bind(productController));
productRoute.delete('/product/:id', authMiddleware, productController.deleteProduct.bind(productController));

export default productRoute;
