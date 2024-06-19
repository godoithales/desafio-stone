import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCreditCardDTO {
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  card_holder_name: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @IsNotEmpty()
  cvv: number;

  @IsString()
  @IsNotEmpty()
  exp_date: string;
}
