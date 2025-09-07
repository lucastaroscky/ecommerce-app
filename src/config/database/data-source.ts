import dotenv from 'dotenv'
import { DataSource } from "typeorm";
import { User } from '../../modules/auth/user.entity';
import { Product } from '../../modules/products/product.entity';
import { Order } from '../../modules/orders/entities/order.entity';
import { OrderItem } from '../../modules/orders/entities/order-item.entity';

dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Product, Order, OrderItem],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: false,
});

async function databaseInit() {
  try {
    await AppDataSource.initialize()
    console.log('Data Source has been initialized!')
  } catch (error) {
    console.error('Error during Data Source initialization', error)
  }
}

export default databaseInit