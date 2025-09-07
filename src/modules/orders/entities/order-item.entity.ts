import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/product.entity';

@Entity('order_items')
@Check('"quantity" > 0')
@Check('"unit_price" >= 0')
@Check('"total_price" >= 0')
@Unique('unique_order_product', ['orderId', 'productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name?: string;

  @Column({ type: 'uuid', name: 'order_id' })
  @Index('idx_order_item_order')
  orderId!: string;

  @Column({ type: 'uuid', name: 'product_id' })
  @Index('idx_order_item_product')
  productId!: string;

  @Column({ type: 'integer', name: 'quantity' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice(): void {
    this.totalPrice = this.quantity * this.unitPrice;
  }
}