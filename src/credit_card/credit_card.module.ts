import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardService } from './credit_card.service';
import { CreditCardRepository } from './credit_card.repository';
import { CreditCardEntity } from './entities/credit_card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCardEntity])],
  providers: [CreditCardService, CreditCardRepository],
  exports: [CreditCardService],
})
export class CreditCardModule {}
