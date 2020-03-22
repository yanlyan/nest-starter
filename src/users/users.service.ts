import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult, UpdateResult } from 'typeorm';
import { UsersDto } from './users.dto';
import { hashSync } from 'bcrypt';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getAllPaginate(
    page,
    size,
    orderBy,
    orderDirection: string,
    search: string = '%',
    roleId,
  ): Promise<[User[], number]> {
    let where = [];
    if (roleId != 0) {
      where = [
        { email: Like(`%${search}%`), role: { id: roleId } },
        { username: Like(`%${search}%`), role: { id: roleId } },
      ];
    } else {
      where = [
        { email: Like(`%${search}%`) },
        { username: Like(`%${search}%`) },
      ];
    }
    return this.userRepository.findAndCount({
      where,
      relations: ['role'],
      take: size,
      skip: page * size,
      order: {
        [orderBy]: orderDirection.toUpperCase(),
      },
    });
  }

  async findByUsername(username: string): Promise<Users> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
  async findByEmail(email: string): Promise<Users> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<Users> {
    return this.userRepository.findOne(id, { relations: ['role'] });
  }

  async create(data: UsersDto): Promise<Users> {
    data.password = hashSync(data.password, 10);
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }
  async update(id: number, data: UsersDto): Promise<UpdateResult> {
    if (data.password) {
      data.password = hashSync(data.password, 10);
    } else {
      delete data.password;
    }
    const user = this.userRepository.update(id, data);
    return user;
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
