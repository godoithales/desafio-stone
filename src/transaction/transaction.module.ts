import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { ClientModule } from 'src/client/client.module';
import { CreditCardModule } from 'src/credit_card/credit_card.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientModule,
    CreditCardModule,
    HistoryModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
