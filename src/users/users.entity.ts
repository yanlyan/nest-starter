import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
  ManyToOne,
} from 'typeorm';
import { Token } from 'src/token/token.entity';
import { Role } from 'src/role/role.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    type => Token,
    token => token.user,
  )
  tokens: Token[];

  @ManyToOne(
    type => Role,
    role => role.users,
  )
  role: Role;
}
