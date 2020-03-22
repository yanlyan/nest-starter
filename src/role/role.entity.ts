import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Route } from '../route/route.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @OneToMany(
    type => Users,
    user => user.role,
  )
  users: Users[];

  @ManyToMany(
    type => Route,
    route => route.roles,
  )
  @JoinTable()
  routes: Route[];
}
