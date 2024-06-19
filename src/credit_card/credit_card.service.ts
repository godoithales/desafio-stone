import { Injectable } from '@nestjs/common';
import { CreditCardRepository } from './credit_card.repository';
import { CreateCreditCardDTO } from './dto/credit_card.dto';
import { CreditCardEntity } from './entities/credit_card.entity';

@Injectable()
export class CreditCardService {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}

  async create(creditCardDto: CreateCreditCardDTO): Promise<CreditCardEntity> {
    const formattedCreditCard = this.formatCreditCardNumber(
      creditCardDto.card_number,
    );

    const newCreditCard: CreateCreditCardDTO = {
      ...creditCardDto,
      card_number: formattedCreditCard,
    };

    return this.creditCardRepository.create(newCreditCard);
  }

  private formatCreditCardNumber(cardNumber: string): string {
    if (cardNumber.length < 12) {
      throw new Error('Invalid card number.');
    }

    const lastFourDigits = cardNumber.slice(-4);
    const maskedNumber = `**** **** **** ${lastFourDigits}`;

    return maskedNumber;
  }
}
