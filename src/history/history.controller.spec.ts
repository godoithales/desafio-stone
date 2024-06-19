/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { HistoryEntity } from './entities/history.entity';

describe('HistoryController', () => {
  let historyController: HistoryController;
  let historyService: HistoryService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findAllByClientId: jest.fn().mockResolvedValue([]),
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

    historyController = moduleRef.get<HistoryController>(HistoryController);
    historyService = moduleRef.get<HistoryService>(HistoryService);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('findAll', () => {
    it('should return an array of history entities', async () => {
      const result: HistoryEntity[] = [];
      jest.spyOn(historyService, 'findAll').mockResolvedValue(result);

      expect(await historyController.findAll()).toBe(result);
      expect(historyService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByClientId', () => {
    it('should return an array of history entities by client ID', async () => {
      const clientId = 'some-uuid';
      const result: HistoryEntity[] = [];
      jest.spyOn(historyService, 'findAllByClientId').mockResolvedValue(result);

      expect(await historyController.findAllByClientId(clientId)).toBe(result);
      expect(historyService.findAllByClientId).toHaveBeenCalledWith(clientId);
      expect(historyService.findAllByClientId).toHaveBeenCalledTimes(1);
    });
  });
});
