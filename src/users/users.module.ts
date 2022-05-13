import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { Customer } from './entities/customer.entity';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';

import { ProductsModule } from '../products/products.module';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Order, OrderItem]),
    ProductsModule,
  ],
  controllers: [CustomerController, UsersController],
  providers: [CustomersService, UsersService],
})
export class UsersModule {}
