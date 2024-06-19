import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dto/product.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let productService: ProductService;
  let repository: Repository<ProductEntity>;
  let cacheService: Cache;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    repository = moduleRef.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    cacheService = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should create a product and delete cache', async () => {
      const product: CreateProductDTO = {
        title: 'Test Product',
        zipcode: '123',
        seller: 'Joe',
        price: 99.99,
        thumbnailHd: 'Test thumb',
        date: '26/11/2015',
      };

      jest.spyOn(repository, 'save').mockResolvedValue(undefined);
      jest.spyOn(cacheService, 'del').mockResolvedValue(true);

      await productService.create(product);

      expect(repository.save).toHaveBeenCalledWith(product);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(cacheService.del).toHaveBeenCalledWith('products');
    });
  });

  describe('findAll', () => {
    it('should return an array of products from cache if available', async () => {
      const result: ProductEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(result);

      expect(await productService.findAll()).toEqual(result);
      expect(cacheService.get).toHaveBeenCalledWith('products');
    });

    it('should return an array of products from repository if not cached', async () => {
      const result: ProductEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'find').mockResolvedValue(result);
      jest.spyOn(cacheService, 'set');

      expect(await productService.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(cacheService.set).toHaveBeenCalledWith('products', result, {
        ttl: 600,
      });
    });
  });
});
