import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { UpdateBrandDto } from '../../products/dtos/brand.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private itemsRepository: Repository<OrderItem>,
  ) {}

  find() {
    return this.itemsRepository.find();
  }

  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepository.findOneOrFail(data.orderId);
    const product = await this.productRepository.findOneOrFail(data.productId);

    if (order && product) {
      const item = new OrderItem(); // There are just a few properties, so we can create it directly
      item.order = order;
      item.product = product;
      item.quantity = data.quantity;
      return this.itemsRepository.save(item);
    } else {
      throw new NotFoundException('Order or product not found');
    }
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const item = await this.itemsRepository.findOneOrFail(id);
    if (item) {
      this.itemsRepository.merge(item, changes);
      return this.itemsRepository.save(item);
    } else {
      throw new NotFoundException('Order item not found');
    }
  }

  async delete(id: number) {
    const item = await this.itemsRepository.findOneOrFail(id);
    if (item) {
      return this.itemsRepository.remove(item);
    } else {
      throw new NotFoundException('Order item not found');
    }
  }
}
