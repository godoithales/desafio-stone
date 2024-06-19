import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { Repository } from 'typeorm';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;
  let repository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    transactionRepository = moduleRef.get<TransactionRepository>(
      TransactionRepository,
    );
    repository = moduleRef.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transactionEntity: TransactionEntity = {} as TransactionEntity;
      jest.spyOn(repository, 'save').mockResolvedValue(transactionEntity);

      const result = await transactionRepository.create(transactionEntity);

      expect(repository.save).toHaveBeenCalledWith(transactionEntity);
      expect(result).toBe(transactionEntity);
    });
  });
});
