import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDTO } from './dto/history.dto';
import { HistoryEntity } from './entities/history.entity';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(HistoryEntity)
    private historyModel: Repository<HistoryEntity>,
  ) {}

  async create(history: CreateHistoryDTO): Promise<void> {
    await this.historyModel.save(history);
  }

  async findAll(): Promise<HistoryEntity[]> {
    const historys = await this.historyModel.find();
    return historys.map((history: any) => {
      history.date = this.formatDate(history.date);
      delete history.id;
      return history;
    });
  }

  async findAllByClientId(clientId: string): Promise<HistoryEntity[]> {
    const historys = await this.historyModel.findBy({ client_id: clientId });
    return historys.map((history: any) => {
      history.date = this.formatDate(history.date);
      delete history.id;
      return history;
    });
  }

  private formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
}
