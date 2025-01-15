import { Request, Response } from 'express';
import logger from '../../../../shared/utils/logger/logger';
import { ErrorResponse, SuccessResponse } from '../../../../shared/utils/response.utils';
import AppError from '../../../../shared/error/app.error';
import { ProductDTO } from '../dto/product.dto';
import { ProductService } from '../services/product.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const user = (req as any).user;
      const productDetails = req.body as ProductDTO;
      const result = await this.productService.create(productDetails, user.id);
      return res.status(201).send(SuccessResponse('Product Created Successfully', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }

  async editProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const productDetails = req.body as ProductDTO;
      const result = await this.productService.edit(id, productDetails);
      return res.status(200).send(SuccessResponse('Product Edited Successfully', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }

  async fetchProductById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await this.productService.fetchProduct(id);
      return res.status(200).send(SuccessResponse('Product Retrieved Successfully', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }

  async fetchUsersProducts(req: Request, res: Response): Promise<any> {
    try {
      const user = (req as any).user;
      const result = await this.productService.fetchUserProducts(user.id);
      return res.status(200).send(SuccessResponse('Products Retrieved Successfully', result));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await this.productService.deleteProducts(id);
      return res.status(200).send(SuccessResponse('Product Deleted Successfully'));
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(error.message);
        return res.status(error.statusCode).send(ErrorResponse(error.message, undefined, error.errorCode));
      }
    }
  }
}
