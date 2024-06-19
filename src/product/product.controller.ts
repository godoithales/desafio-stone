import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/product.dto';
import { ProductEntity } from './entities/product.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() product: CreateProductDTO): Promise<void> {
    await this.productService.create(product);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<ProductEntity[]> {
    return await this.productService.findAll();
  }
}
