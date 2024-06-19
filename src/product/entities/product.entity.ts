import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  zipcode: string;

  @Column()
  seller: string;

  @Column()
  thumbnailHd: string;

  @Column()
  date: Date;
}
