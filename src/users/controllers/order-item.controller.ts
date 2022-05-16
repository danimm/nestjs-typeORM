import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';

@ApiTags('order-item')
@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Get()
  find(): Promise<OrderItem[]> {
    return this.orderItemService.find();
  }

  @Post()
  create(@Body() item: CreateOrderItemDto) {
    return this.orderItemService.create(item);
  }
}
