import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
