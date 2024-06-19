import { Inject, Injectable } from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { HistoryEntity } from './entities/history.entity';
import { CreateHistoryDTO } from './dto/history.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(history: CreateHistoryDTO): Promise<void> {
    await this.historyRepository.create(history);
    await this.cacheService.del('history');
    await this.cacheService.del(`history:${history.client_id}`);
  }

  async findAll(): Promise<HistoryEntity[]> {
    const cachedHistory =
      await this.cacheService.get<HistoryEntity[]>('history');
    if (cachedHistory) {
      return cachedHistory;
    }

    const history = await this.historyRepository.findAll();
    await this.cacheService.set('history', history, { ttl: 600 });
    return history;
  }

  async findAllByClientId(clientId: string): Promise<HistoryEntity[]> {
    const cachedHistory = await this.cacheService.get<HistoryEntity[]>(
      `history:${clientId}`,
    );
    if (cachedHistory) {
      return cachedHistory;
    }

    const history = await this.historyRepository.findAllByClientId(clientId);
    await this.cacheService.set(`history:${clientId}`, history, { ttl: 600 });
    return history;
  }
}
