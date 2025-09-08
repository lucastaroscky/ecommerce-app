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
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../auth/user/user.entity';
import BadRequestException from '../../common/exceptions/bad-request.exception';
import { ORDER_CANNOT_BE_CANCELLED } from '../../common/constants/error-messages.constants';

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
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderItem[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalAmount() {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatus.PLACED || this.status === OrderStatus.PAID;
  }

  updateStatus(newStatus: OrderStatus): void {
    if (this.status === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
      throw new BadRequestException(ORDER_CANNOT_BE_CANCELLED);
    }

    this.status = newStatus;
  }
}