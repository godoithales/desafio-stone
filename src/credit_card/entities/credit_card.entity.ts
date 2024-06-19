import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

@Entity('credit_card')
export class CreditCardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  card_number: string;

  @Column()
  card_holder_name: string;

  @Column()
  value: number;

  @Column()
  cvv: number;

  @Column()
  exp_date: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.credit_card)
  transactions: TransactionEntity[];
}
