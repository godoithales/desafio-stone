import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
            findAll: jest.fn().mockResolvedValue([]),
          },
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

    productController = moduleRef.get<ProductController>(ProductController);
    productService = moduleRef.get<ProductService>(ProductService);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should call product service', async () => {
      const createProductDto: CreateProductDTO = {
        title: 'Test Product',
        zipcode: '123',
        seller: 'Joe',
        price: 99.99,
        thumbnailHd: 'Test thumb',
        date: '26/11/2015',
      };

      await productController.create(createProductDto);

      expect(productService.create).toHaveBeenCalledWith(createProductDto);
      expect(productService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call product service to find all products', async () => {
      await productController.findAll();

      expect(productService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
