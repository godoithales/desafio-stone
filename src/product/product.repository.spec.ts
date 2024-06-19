import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dto/product.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productRepository = moduleRef.get<ProductRepository>(ProductRepository);
    repository = moduleRef.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  describe('create', () => {
    it('should save a new product entity', async () => {
      const createProductDto: CreateProductDTO = {
        title: 'Test Product',
        zipcode: '123',
        seller: 'Joe',
        price: 99.99,
        thumbnailHd: 'Test thumb',
        date: '26/11/2015',
      };

      const productEntity = new ProductEntity();
      Object.assign(productEntity, createProductDto);

      jest.spyOn(repository, 'save').mockResolvedValue(productEntity);

      await productRepository.create(createProductDto);

      expect(repository.save).toHaveBeenCalledWith(createProductDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of product entities', async () => {
      const result: ProductEntity[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await productRepository.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an array of product entities with formatted dates and without id', async () => {
      const historyEntity: ProductEntity = {
        id: '123',
        title: 'Test Product',
        zipcode: '123',
        seller: 'Joe',
        price: 99.99,
        thumbnailHd: 'Test thumb',
        date: new Date(),
      };
      jest.spyOn(repository, 'find').mockResolvedValue([historyEntity]);

      const result = await productRepository.findAll();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].id).toBeUndefined();
      expect(result[0].date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
});
