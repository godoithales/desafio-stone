import { ClientEntity } from 'src/client/entities/client.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('history')
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  card_number: string;

  @Column()
  client_id: string;

  @Column()
  value: number;

  @Column()
  purchase_id: string;

  @Column()
  date: Date;

  @ManyToOne(() => ClientEntity, (client) => client.histories)
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientEntity;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.histories)
  @JoinColumn({ name: 'purchase_id', referencedColumnName: 'id' })
  transaction: TransactionEntity;
}
