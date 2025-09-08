import { NextFunction, Response } from "express";
import { CreateOrderDto } from "./order.dto";
import { OrderService } from "./order.service";
import { CustomRequest } from "../common/interfaces/custom-request.interface";
import HTTP_STATUS from "../common/enums/http-status.enum";
import { ORDER_CREATED } from "../common/constants/error-messages.constants";

export class OrderController {
  constructor(private orderService: OrderService) { }

  async createOrder(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { name, notes, items } = req.body as CreateOrderDto;
      const userId = req.loggedUser?.userId!;

      const order = await this.orderService.createOrder({ name, notes, userId, items });

      return res.status(HTTP_STATUS.CREATED).json({ code: HTTP_STATUS.CREATED, message: ORDER_CREATED, data: order });
    }
    catch (error) {
      next(error);
    }
  }

  async getOrders(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.loggedUser?.userId!;
      const role = req.loggedUser?.role!;

      const orders = await this.orderService.getOrdersByUser({ userId, role, filters: req.query });

      return res.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, data: orders });
    }
    catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;

      const { status } = req.body;

      const updatedOrder = await this.orderService.updateOrderStatus({ orderId, status });

      return res.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, data: updatedOrder });
    }
    catch (error) {
      next(error);
    }
  }
}