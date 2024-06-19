import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productModel: Repository<ProductEntity>,
  ) {}

  async create(product: CreateProductDTO): Promise<void> {
    await this.productModel.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productModel.find();
    return products.map((product: any) => {
      product.date = this.formatDate(product.date);
      delete product.id;
      return product;
    });
  }

  private formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
}
