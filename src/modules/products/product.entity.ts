import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Check,
  DeleteDateColumn,
} from 'typeorm';
import { OrderItem } from '../orders/entities/order-item.entity';
import { User } from '../auth/user/user.entity';

@Entity('products')
@Check('"price" >= 0')
@Check('"stock_quantity" >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  @Index('idx_product_name')
  name!: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  price!: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'photo' })
  photo!: string;

  @Column({ type: 'integer', default: 0, name: 'stock_quantity' })
  stockQuantity!: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @Index('idx_product_active')
  isActive!: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_id' })
  createdById!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;

  @ManyToOne(() => User, (user) => user.createdProducts, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  hasStock(quantity: number): boolean {
    return this.stockQuantity >= quantity;
  }

  reduceStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error('Insufficient stock');
    }

    this.stockQuantity -= quantity;
  }
}