import { NextFunction, Request, Response } from 'express';
import { ProductService } from './product.service';
import HTTP_STATUS from '../common/enums/http-status.enum';
import { PRODUCT_CREATED, PRODUCT_UPDATED } from '../common/constants/error-messages.constants';
import { CustomRequest } from '../common/interfaces/custom-request.interface';

export class ProductController {
  constructor(private readonly productService: ProductService) { }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.findAll(req.query);

      return res.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, data: products });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { name, description, price, photo, stockQuantity } = req.body;

      const product = await this.productService.createProduct({ name, description, price, photo, stockQuantity, createdById: req.loggedUser?.userId! });

      return res.status(HTTP_STATUS.CREATED).json({ code: HTTP_STATUS.CREATED, message: PRODUCT_CREATED, data: product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, price, photo, stockQuantity } = req.body;

      const product = await this.productService.updateProduct(id, {
        name,
        description,
        price,
        photo,
        stockQuantity
      });

      return res.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, message: PRODUCT_UPDATED, data: product });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.productService.deleteProduct(id);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
