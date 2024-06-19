import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHistoryDTO {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  purchase_id: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
