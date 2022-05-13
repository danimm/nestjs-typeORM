import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToMany((type) => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
