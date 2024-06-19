import { ClientEntity } from 'src/client/entities/client.entity';
import { HistoryEntity } from 'src/history/entities/history.entity';

import { CreditCardEntity } from 'src/credit_card/entities/credit_card.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientEntity, (client) => client.transactions)
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientEntity;

  @ManyToOne(() => CreditCardEntity, (credit_card) => credit_card.transactions)
  @JoinColumn({ name: 'credit_card_id', referencedColumnName: 'id' })
  credit_card: CreditCardEntity;

  @Column()
  client_name: string;

  @Column()
  total_to_pay: number;

  @OneToMany(() => HistoryEntity, (history) => history.client)
  histories: HistoryEntity[];
}
