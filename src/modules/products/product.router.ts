import { Router } from "express";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { validateBody, validateParams, validateQuery } from "../common/middlewares/validate-dto.middleware";
import { CreateProductBodyDto, ProductQueryDto, UpdateProductBodyDto, ProductParamsDto } from "./product.dto";
import { authMiddleware } from "../common/middlewares/auth.middleware";
import { isAdminMiddleware } from "../common/middlewares/admin.middleware";

const productRouter = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

productRouter.get('/products', validateQuery(ProductQueryDto), authMiddleware, async (req, res, next) => productController.getAllProducts(req, res, next));

productRouter.post('/products', validateBody(CreateProductBodyDto), authMiddleware, isAdminMiddleware, async (req, res, next) => productController.createProduct(req, res, next));
productRouter.patch('/products/:id', validateParams(ProductParamsDto), validateBody(UpdateProductBodyDto), authMiddleware, isAdminMiddleware, async (req, res, next) => productController.updateProduct(req, res, next));
productRouter.delete('/products/:id', validateParams(ProductParamsDto), authMiddleware, isAdminMiddleware, async (req, res, next) => productController.deleteProduct(req, res, next));

export default productRouter;