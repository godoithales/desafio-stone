import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { CreditCardService } from 'src/credit_card/credit_card.service';
import { ClientService } from 'src/client/client.service';
import { HistoryService } from 'src/history/history.service';
import { CreateTransactionDTO } from './dto/transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { ClientEntity } from 'src/client/entities/client.entity';
import { CreditCardEntity } from 'src/credit_card/entities/credit_card.entity';
import { UnprocessableEntityException } from '@nestjs/common';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: TransactionRepository;
  let creditCardService: CreditCardService;
  let clientService: ClientService;
  let historyService: HistoryService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CreditCardService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({} as ClientEntity),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = moduleRef.get<TransactionService>(TransactionService);
    transactionRepository = moduleRef.get<TransactionRepository>(
      TransactionRepository,
    );
    creditCardService = moduleRef.get<CreditCardService>(CreditCardService);
    clientService = moduleRef.get<ClientService>(ClientService);
    historyService = moduleRef.get<HistoryService>(HistoryService);
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDTO = {
        client_id: '1',
        credit_card: {} as any,
        client_name: 'Test Client',
        total_to_pay: 100,
      };

      jest
        .spyOn(clientService, 'findOneById')
        .mockResolvedValue({} as ClientEntity);
      jest
        .spyOn(creditCardService, 'create')
        .mockResolvedValue({} as CreditCardEntity);
      jest
        .spyOn(transactionRepository, 'create')
        .mockResolvedValue({} as TransactionEntity);
      jest.spyOn(historyService, 'create').mockImplementationOnce(undefined);

      await transactionService.create(createTransactionDto);

      expect(clientService.findOneById).toHaveBeenCalledWith('1');
      expect(creditCardService.create).toHaveBeenCalled();
      expect(transactionRepository.create).toHaveBeenCalled();
      expect(historyService.create).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException if client does not exist', async () => {
      const createTransactionDto: CreateTransactionDTO = {
        client_id: '1',
        credit_card: {} as any,
        client_name: 'Test Client',
        total_to_pay: 100,
      };

      jest.spyOn(clientService, 'findOneById').mockResolvedValue(null);

      await expect(
        transactionService.create(createTransactionDto),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
