import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { Customer } from '../entities/customer.entity';

import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll() {
    return this.orderRepository.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneOrFail(id, {
      relations: ['items', 'items.product', 'customer'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async create(data: CreateOrderDto) {
    const order = new Order();
    if (data.customerId) {
      order.customer = await this.customerRepository.findOneOrFail(
        data.customerId,
      );
    }
    return this.orderRepository.save(order);
  }

  async update(id: number, data: UpdateOrderDto) {
    const order = await this.orderRepository.findOneOrFail(id);
    if (data.customerId) {
      order.customer = await this.customerRepository.findOneOrFail(
        data.customerId,
      );
    }
    return this.orderRepository.save(order);
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
