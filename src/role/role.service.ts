import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository, Like } from 'typeorm';
import { RouteService } from 'src/route/route.service';
import { RoleDTO } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly routeService: RouteService,
  ) {}
  async findById(id): Promise<Role> {
    return this.roleRepository.findOne(id, { relations: ['routes'] });
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async getAllPaginate(
    page,
    size,
    orderBy,
    orderDirection: string,
    search: string = '%',
  ): Promise<[Role[], number]> {
    return this.roleRepository.findAndCount({
      where: [{ name: Like(`%${search}%`) }],
      relations: ['routes'],
      take: size,
      skip: page * size,
      order: {
        [orderBy]: orderDirection.toUpperCase(),
      },
    });
  }

  async create(data: RoleDTO): Promise<Role> {
    const routes = [];
    for (let i = 0; i < data.routes.length; i++) {
      const route = await this.routeService.findById(data.routes[i].id);
      routes.push(route);
    }
    const role = new Role();
    role.name = data.name;
    role.routes = routes;
    return await this.roleRepository.save(role);
  }

  async update(id: number, data: RoleDTO): Promise<Role> {
    const routes = [];
    for (let i = 0; i < data.routes.length; i++) {
      const route = await this.routeService.findById(data.routes[i].id);
      routes.push(route);
    }
    const role = await this.roleRepository.findOne(id);
    role.name = data.name;
    role.routes = routes;
    return await this.roleRepository.save(role);
  }

  async delete(id: number): Promise<any> {
    return await this.roleRepository.delete(id);
  }

  async assign(roleId: number, routeId: number): Promise<any> {
    const route = await this.routeService.findById(routeId);
    const role = await this.roleRepository.findOne(roleId, {
      relations: ['routes'],
    });
    role.routes.push(route);
    return await this.roleRepository.save(role);
  }
}
