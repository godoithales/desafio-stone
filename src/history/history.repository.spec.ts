import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryRepository } from './history.repository';
import { HistoryEntity } from './entities/history.entity';
import { CreateHistoryDTO } from './dto/history.dto';
import { ClientEntity } from 'src/client/entities/client.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

describe('HistoryRepository', () => {
  let historyRepository: HistoryRepository;
  let repository: Repository<HistoryEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryRepository,
        {
          provide: getRepositoryToken(HistoryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    historyRepository = moduleRef.get<HistoryRepository>(HistoryRepository);
    repository = moduleRef.get<Repository<HistoryEntity>>(
      getRepositoryToken(HistoryEntity),
    );
  });

  describe('create', () => {
    it('should save a history', async () => {
      const createHistoryDto: CreateHistoryDTO = {
        client_id: 'some-client-id',
        purchase_id: 'some-purchase-id',
        value: 123,
        card_number: '123',
        date: new Date(),
      };

      const historyEntity = new HistoryEntity();
      Object.assign(historyEntity, createHistoryDto);

      jest.spyOn(repository, 'save').mockResolvedValue(historyEntity);

      await historyRepository.create(createHistoryDto);

      expect(repository.save).toHaveBeenCalledWith(createHistoryDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of history', async () => {
      const result: HistoryEntity[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await historyRepository.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an array of history entities with formatted dates and without id', async () => {
      const historyEntity: HistoryEntity = {
        id: '123',
        client: {} as ClientEntity,
        transaction: {} as TransactionEntity,
        client_id: 'some-client-id',
        purchase_id: 'some-purchase-id',
        value: 123,
        card_number: '123',
        date: new Date(),
      };
      jest.spyOn(repository, 'find').mockResolvedValue([historyEntity]);

      const result = await historyRepository.findAll();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].id).toBeUndefined();
      expect(result[0].date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('findAllByClientId', () => {
    it('should return an array of history entities by client ID', async () => {
      const clientId = 'some-client-id';
      const result: HistoryEntity[] = [];
      jest.spyOn(repository, 'findBy').mockResolvedValue(result);

      expect(await historyRepository.findAllByClientId(clientId)).toEqual(
        result,
      );
      expect(repository.findBy).toHaveBeenCalledWith({ client_id: clientId });
      expect(repository.findBy).toHaveBeenCalledTimes(1);
    });

    it('should return an array of history entities by client ID with formatted dates and without id', async () => {
      const clientId = 'some-client-id';
      const historyEntity: HistoryEntity = {
        id: '123',
        client: {} as ClientEntity,
        transaction: {} as TransactionEntity,
        client_id: 'some-client-id',
        purchase_id: 'some-purchase-id',
        value: 123,
        card_number: '123',
        date: new Date(),
      };
      jest.spyOn(repository, 'findBy').mockResolvedValue([historyEntity]);

      const result = await historyRepository.findAllByClientId(clientId);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].id).toBeUndefined();
      expect(result[0].date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
});
