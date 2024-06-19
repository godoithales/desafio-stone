import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCreditCardDTO } from './dto/credit_card.dto';
import { CreditCardEntity } from './entities/credit_card.entity';

@Injectable()
export class CreditCardRepository {
  constructor(
    @InjectRepository(CreditCardEntity)
    private creditCardModel: Repository<CreditCardEntity>,
  ) {}

  async create(CreditCard: CreateCreditCardDTO): Promise<CreditCardEntity> {
    return await this.creditCardModel.save(CreditCard);
  }
}
