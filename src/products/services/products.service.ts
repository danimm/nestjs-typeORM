import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindConditions } from 'typeorm';

import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private catergoryRepository: Repository<Category>,
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const { limit, offset, minPrice, maxPrice } = params;
      const where: FindConditions<Product> = {};
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      return this.productRepository.find({
        relations: ['brand'],
        where,
        take: limit,
        skip: offset,
        order: {
          createdAt: 'ASC',
        },
      });
    }
    return this.productRepository.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productRepository.create(data);
    if (data.brandId) {
      newProduct.brand = await this.brandRepository.findOne(data.brandId);
    }
    if (data.categoriesId) {
      newProduct.categories = await this.catergoryRepository.findByIds(
        data.categoriesId,
      );
    }
    return this.productRepository.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);
    if (changes.brandId) {
      product.brand = await this.brandRepository.findOne(changes.brandId);
    }
    if (changes.categoriesId) {
      product.categories = await this.catergoryRepository.findByIds(
        changes.categoriesId,
      );
    }
    this.productRepository.merge(product, changes);
    return this.productRepository.save(product);
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );
    return this.productRepository.save(product);
  }

  async addCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const category = await this.catergoryRepository.findOne(categoryId);
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }

    if (!product.categories.find((cat) => cat.id === categoryId)) {
      product.categories.push(category);
    } else {
      throw new ConflictException(
        `Category #${categoryId} is already present in this product`,
      );
    }

    return this.productRepository.save(product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
