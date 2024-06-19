import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dto/transaction.dto';

@Controller('buy')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() transaction: CreateTransactionDTO): Promise<void> {
    await this.transactionService.create(transaction);
  }
}
