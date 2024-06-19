import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryEntity } from './entities/history.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<HistoryEntity[]> {
    return await this.historyService.findAll();
  }

  @Get(':clientId')
  @UseInterceptors(CacheInterceptor)
  async findAllByClientId(
    @Param('clientId', new ParseUUIDPipe()) clientId: string,
  ): Promise<HistoryEntity[]> {
    return await this.historyService.findAllByClientId(clientId);
  }
}
