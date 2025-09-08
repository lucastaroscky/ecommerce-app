import { FindOptionsWhere, In } from "typeorm";
import { AppDataSource } from "../../config/database/data-source";
import { Product } from "../products/product.entity";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderDto, GetOrdersFilterQueryDto } from "./order.dto";
import { User, UserRole } from "../auth/user/user.entity";
import NotFoundException from "../common/exceptions/not-found.exception";
import { ORDER_NOT_FOUND } from "../common/constants/error-messages.constants";

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private productRepository = AppDataSource.getRepository(Product);

    async createOrder(order: CreateOrderDto) {
        return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const products = await this.productRepository.findBy({ id: In(order.items.map(item => item.productId)) });
            console.log(order)
            const productsOrder = products.map(product => {
                return {
                    product,
                    name: product.name,
                    unitPrice: product.price,
                    quantity: order.items.find(item => item.productId === product.id)?.quantity || 0,
                }
            })

            const newOrder = this.orderRepository.create({
                notes: order.notes,
                name: order.name,
                items: productsOrder,
                user: { id: order.userId },
            })

            const savedOrder = await transactionalEntityManager.save(newOrder);

            const reduceStockFromItems = order.items.map(async (item) => {
                const product = await this.productRepository.findOne({ where: { id: item.productId } });

                if (product) {
                    product.reduceStock(item.quantity);
                    await transactionalEntityManager.save(product);
                }
            });

            await Promise.all(reduceStockFromItems);

            return savedOrder;
        });
    }

    async getOrdersByUser({ userId, role, filters }: { userId: string, role: UserRole, filters: GetOrdersFilterQueryDto }) {
        const { status, page = 1, limit = 10 } = filters;

        const where: FindOptionsWhere<Order> = {};

        if (role === UserRole.USER) where.user = { id: userId };
        if (status) where.status = status as OrderStatus;

        const [orders, total] = await this.orderRepository.findAndCount({
            where,
            relations: ["items", "items.product"],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async updateOrderStatus({ orderId, status }: { orderId: string, status: OrderStatus }) {
        return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const order = await transactionalEntityManager.findOne(Order, {
                where: { id: orderId },
                relations: ["items", "items.product"],
            });

            if (!order) throw new NotFoundException(ORDER_NOT_FOUND);

            if (status === OrderStatus.CANCELLED && order.canBeCancelled()) {
                for (const item of order.items) {
                    item.product.stockQuantity += item.quantity;
                    await transactionalEntityManager.save(item.product);
                }
            }

            order.updateStatus(status);
            return transactionalEntityManager.save(order);
        });
    }
}