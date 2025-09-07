import { DataSource } from "typeorm";
import 'reflect-metadata';
import { User } from "./src/modules/auth/user.entity";
import { Product } from "./src/modules/products/product.entity";
import { Order } from "./src/modules/orders/order.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, Product, Order],
  migrations: ["src/database/migrations/*.ts"],
});
