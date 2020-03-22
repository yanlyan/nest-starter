import { Injectable } from '@nestjs/common';
import { Route } from './route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult } from 'typeorm';
import { RouteDTO } from './route.dto';
import { Role } from 'src/role/role.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAllPaginate(
    page,
    size,
    orderBy,
    orderDirection: string,
    search: string = '%',
  ): Promise<[Route[], number]> {
    return this.routeRepository.findAndCount({
      where: [{ path: Like(`%${search}%`) }, { method: Like(`%${search}%`) }],
      take: size,
      skip: page * size,
      order: {
        [orderBy]: orderDirection.toUpperCase(),
      },
    });
  }

  async getAll() {
    return this.routeRepository.find({
      order: { group: 'ASC', path: 'ASC', method: 'ASC' },
    });
  }

  async create(data: RouteDTO): Promise<Route> {
    const route = this.routeRepository.create(data);
    const roles = [];
    for (let i = 0; i < data.roles.length; i++) {
      const role = await this.roleRepository.findOne(data.roles[i].id);
      roles.push(role);
    }
    route.roles = roles;
    return this.routeRepository.save(route);
  }

  async update(id: number, data: RouteDTO): Promise<Route> {
    const roles = [];
    for (let i = 0; i < data.roles.length; i++) {
      const role = await this.roleRepository.findOne(data.roles[i].id);
      roles.push(role);
    }
    const route = await this.routeRepository.findOne(id);
    route.path = data.path;
    route.method = data.method;
    route.isRegex = data.isRegex;
    route.roles = roles;
    return this.routeRepository.save(route);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.routeRepository.delete(id);
  }

  async findById(id: number): Promise<Route> {
    return this.routeRepository.findOne(id, {
      relations: ['roles'],
    });
  }
}
