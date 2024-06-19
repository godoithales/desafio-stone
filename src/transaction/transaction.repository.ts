import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionModel: Repository<TransactionEntity>,
  ) {}

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return await this.transactionModel.save(transaction);
  }
}
