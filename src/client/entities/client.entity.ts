import { HistoryEntity } from 'src/history/entities/history.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.client)
  transactions: TransactionEntity[];

  @OneToMany(() => HistoryEntity, (history) => history)
  histories: HistoryEntity[];
}
