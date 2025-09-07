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
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PLACED = 'PLACED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
@Check('"total_amount" >= 0')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name?: string;

  @Column({ type: 'uuid', name: 'user_id' })
  @Index('idx_order_user')
  userId!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PLACED,
    name: 'status'
  })
  @Index('idx_order_status')
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount!: number;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_order_created_at')
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderItem[];

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatus.PLACED || this.status === OrderStatus.PAID;
  }

  updateStatus(newStatus: OrderStatus): void {
    if (this.status === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
      throw new Error('Cannot change status of cancelled order');
    }
    this.status = newStatus;
  }
}