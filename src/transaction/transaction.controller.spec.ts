import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dto/transaction.dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    transactionController = moduleRef.get<TransactionController>(
      TransactionController,
    );
    transactionService = moduleRef.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('should call transaction service', async () => {
      const createTransactionDto: CreateTransactionDTO =
        {} as CreateTransactionDTO;

      await transactionController.create(createTransactionDto);

      expect(transactionService.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transactionService.create).toHaveBeenCalledTimes(1);
    });
  });
});
