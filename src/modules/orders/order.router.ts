import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { validateBody } from "../common/middlewares/validate-dto.middleware";
import { CreateOrderDto } from "./order.dto";
import { authMiddleware } from "../common/middlewares/auth.middleware";

const orderRouter = Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService);

orderRouter.post('/orders', validateBody(CreateOrderDto), authMiddleware, async (req, res, next) => orderController.createOrder(req, res, next));
orderRouter.get('/orders', authMiddleware, async (req, res, next) => orderController.getOrders(req, res, next));

export default orderRouter;
