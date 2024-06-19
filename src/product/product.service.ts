import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDTO } from './dto/product.dto';
import { ProductEntity } from './entities/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(product: CreateProductDTO): Promise<void> {
    const newProduct = await this.productRepository.create(product);
    await this.cacheService.del('products');
    return newProduct;
  }

  async findAll(): Promise<ProductEntity[]> {
    const cachedProducts =
      await this.cacheService.get<ProductEntity[]>('products');
    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productRepository.findAll();
    await this.cacheService.set('products', products, { ttl: 600 });
    return products;
  }
}
