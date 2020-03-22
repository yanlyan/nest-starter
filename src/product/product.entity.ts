import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pages: number;

  @Column({ default: true })
  isTitle: boolean;

  @Column()
  picture: string;
}
