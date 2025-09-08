import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { validateBody, validateQuery } from "../common/middlewares/validate-dto.middleware";
import { CreateOrderDto, GetOrdersFilterQueryDto, UpdateOrderStatusDto } from "./order.dto";
import { authMiddleware } from "../common/middlewares/auth.middleware";
import { isAdminMiddleware } from "../common/middlewares/admin.middleware";

const orderRouter = Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService);

orderRouter.post('/orders', validateBody(CreateOrderDto), authMiddleware, async (req, res, next) => orderController.createOrder(req, res, next));
orderRouter.get('/orders', validateQuery(GetOrdersFilterQueryDto), authMiddleware, async (req, res, next) => orderController.getOrders(req, res, next));
orderRouter.patch('/orders/:id/status', validateBody(UpdateOrderStatusDto), authMiddleware, isAdminMiddleware, async (req, res, next) => orderController.updateOrderStatus(req, res, next));

export default orderRouter;
