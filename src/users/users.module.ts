import { Module } from '@nestjs/common';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { ProductsService } from '../products/services/products.service';

@Module({
  imports: [],
  controllers: [CustomerController, UsersController],
  providers: [CustomersService, UsersService, ProductsService],
})
export class UsersModule {}
