import dotenv from 'dotenv'
import { DataSource } from "typeorm";
import { User } from "../modules/auth/user.entity";
import { Product } from "../modules/products/product.entity";
import { Order } from "../modules/orders/entities/order.entity";
import { OrderItem } from "../modules/orders/entities/order-item.entity";

dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Product, Order, OrderItem],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
