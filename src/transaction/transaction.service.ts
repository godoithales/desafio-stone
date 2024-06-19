import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDTO } from './dto/transaction.dto';
import { CreditCardService } from 'src/credit_card/credit_card.service';
import { ClientService } from 'src/client/client.service';
import { TransactionEntity } from './entities/transaction.entity';
import { HistoryService } from 'src/history/history.service';
import { HistoryEntity } from 'src/history/entities/history.entity';
import { ClientEntity } from 'src/client/entities/client.entity';
import { CreditCardEntity } from 'src/credit_card/entities/credit_card.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly creditCardService: CreditCardService,
    private readonly clientService: ClientService,
    private readonly historyService: HistoryService,
  ) {}

  async create(transaction: CreateTransactionDTO): Promise<void> {
    const client = await this.clientService.findOneById(transaction.client_id);
    if (!client) {
      throw new UnprocessableEntityException('Client not exists.');
    }

    const creditCard = await this.creditCardService.create(
      transaction.credit_card,
    );

    const newTransaction = await this.createTransactionEntity(
      client,
      creditCard,
      transaction,
    );

    await this.transactionRepository.create(newTransaction);

    const newHistory = this.createHistoryEntity(creditCard, newTransaction);

    await this.historyService.create(newHistory);
  }

  private createTransactionEntity(
    client: ClientEntity,
    creditCard: CreditCardEntity,
    transaction: CreateTransactionDTO,
  ): TransactionEntity {
    const newTransaction = new TransactionEntity();
    newTransaction.client = client;
    newTransaction.credit_card = creditCard;
    newTransaction.client_name = transaction.client_name;
    newTransaction.total_to_pay = transaction.total_to_pay;
    return newTransaction;
  }

  private createHistoryEntity(
    creditCard: CreditCardEntity,
    transaction: TransactionEntity,
  ): HistoryEntity {
    const newHistory = new HistoryEntity();
    newHistory.card_number = creditCard.card_number;
    newHistory.client_id = transaction.client.id;
    newHistory.date = new Date();
    newHistory.purchase_id = transaction.id;
    newHistory.value = transaction.total_to_pay;
    return newHistory;
  }
}
