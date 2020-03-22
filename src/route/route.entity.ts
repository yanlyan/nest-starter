import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from 'src/role/role.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  group: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRegex: boolean;

  @ManyToMany(
    type => Role,
    role => role.routes,
  )
  roles: Role[];
}
