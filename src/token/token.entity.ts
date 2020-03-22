import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/users.entity';

export enum TokenType {
  JWT_REFRESH_TOKEN = 'jwt_refresh_token',
  JWT_ACCESS_TOKEN = 'jwt_access_token',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => Users,
    user => user.tokens,
  )
  user: Users;

  @Column({
    type: 'enum',
    enum: TokenType,
    nullable: false,
    default: TokenType.JWT_REFRESH_TOKEN,
  })
  type: TokenType;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  validUntil: Date;
}
