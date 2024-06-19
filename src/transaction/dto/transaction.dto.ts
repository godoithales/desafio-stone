import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCreditCardDTO } from 'src/credit_card/dto/credit_card.dto';

class CreditCard extends CreateCreditCardDTO {}

export class CreateTransactionDTO {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsNumber()
  @IsNotEmpty()
  total_to_pay: number;

  @ValidateNested()
  @Type(() => CreditCard)
  credit_card: CreditCard;
}
