import 'dotenv/config';
import { DataSource } from "typeorm";
import { Product } from '../../modules/products/product.entity';
import { Order } from '../../modules/orders/entities/order.entity';
import { OrderItem } from '../../modules/orders/entities/order-item.entity';
import { User } from '../../modules/auth/user/user.entity';

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Product, Order, OrderItem],
  migrations: ["src/config/database/migrations/*.ts"],
  schema: 'public',
  synchronize: false,
  logging: false,
});
