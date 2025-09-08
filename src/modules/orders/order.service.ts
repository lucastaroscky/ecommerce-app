import { FindOptionsWhere, In } from "typeorm";
import { AppDataSource } from "../../config/database/data-source";
import { Product } from "../products/product.entity";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderDto, GetOrdersFilterQueryDto } from "./order.dto";
import { User, UserRole } from "../auth/user/user.entity";

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private productRepository = AppDataSource.getRepository(Product);

    async createOrder(order: CreateOrderDto) {
        return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const products = await this.productRepository.findBy({ id: In(order.items.map(item => item.productId)) });
            console.log(order)
            const productsOrder = products.map(product => {
                return {
                    productId: product.id,
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
}