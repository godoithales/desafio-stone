import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HistoryService } from './history.service';
import { HistoryRepository } from './history.repository';
import { HistoryEntity } from './entities/history.entity';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let historyRepository: HistoryRepository;
  let cacheService: Cache;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: HistoryRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByClientId: jest.fn(),
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

    historyService = moduleRef.get<HistoryService>(HistoryService);
    historyRepository = moduleRef.get<HistoryRepository>(HistoryRepository);
    cacheService = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should create a history and delete cache', async () => {
      const history: HistoryEntity = {
        client_id: '123',
        purchase_id: 'some-purchase-id',
        value: 123,
        card_number: '123',
        date: new Date(),
      } as HistoryEntity;

      await historyService.create(history);

      expect(historyRepository.create).toHaveBeenCalledWith(history);
      expect(historyRepository.create).toHaveBeenCalledTimes(1);
      expect(cacheService.del).toHaveBeenCalledWith(
        `history:${history.client_id}`,
      );
    });

    it('should return an array of history entities from repository if not cached', async () => {
      const result: HistoryEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(historyRepository, 'findAll').mockResolvedValue(result);
      jest.spyOn(cacheService, 'set');

      expect(await historyService.findAll()).toBe(result);
      expect(historyRepository.findAll).toHaveBeenCalledTimes(1);
      expect(cacheService.set).toHaveBeenCalledWith('history', result, {
        ttl: 600,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of history entities from cache', async () => {
      const result: HistoryEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(result);

      expect(await historyService.findAll()).toBe(result);
      expect(cacheService.get).toHaveBeenCalledWith('history');
    });

    it('should return an array of history entities from repository if not cached', async () => {
      const result: HistoryEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(historyRepository, 'findAll').mockResolvedValue(result);
      jest.spyOn(cacheService, 'set');

      expect(await historyService.findAll()).toBe(result);
      expect(historyRepository.findAll).toHaveBeenCalledTimes(1);
      expect(cacheService.set).toHaveBeenCalledWith('history', result, {
        ttl: 600,
      });
    });
  });

  describe('findAllByClientId', () => {
    it('should return an array of history entities by client ID from cache', async () => {
      const clientId = 'some-uuid';
      const result: HistoryEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(result);

      expect(await historyService.findAllByClientId(clientId)).toBe(result);
      expect(cacheService.get).toHaveBeenCalledWith(`history:${clientId}`);
    });

    it('should return an array of history entities by client ID from repository if not cached', async () => {
      const clientId = 'some-uuid';
      const result: HistoryEntity[] = [];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(historyRepository, 'findAllByClientId')
        .mockResolvedValue(result);
      jest.spyOn(cacheService, 'set');

      expect(await historyService.findAllByClientId(clientId)).toBe(result);
      expect(historyRepository.findAllByClientId).toHaveBeenCalledWith(
        clientId,
      );
      expect(cacheService.set).toHaveBeenCalledWith(
        `history:${clientId}`,
        result,
        { ttl: 600 },
      );
    });
  });
});
