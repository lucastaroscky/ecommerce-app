import { In } from "typeorm";
import { AppDataSource } from "../../config/database/data-source";
import { Product } from "../products/product.entity";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderDto } from "./order.dto";

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private productRepository = AppDataSource.getRepository(Product);

    async createOrder(order: CreateOrderDto) {
        return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const products = await this.productRepository.findBy({ id: In(order.items.map(item => item.productId)) });

            const productsOrder = products.map(product => {
                return {
                    productId: product.id,
                    name: product.name,
                    unitPrice: product.price,
                    quantity: order.items.find(item => item.productId === product.id)?.quantity || 0,
                }
            })

            const newOrder = this.orderRepository.create({
                user: { id: order.userId },
                notes: order.notes,
                name: order.name,
                items: productsOrder,
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
}