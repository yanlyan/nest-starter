import {
  Controller,
  Put,
  Body,
  Get,
  Query,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDTO } from './role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('paginate')
  async getAllPaginate(@Query() param: any) {
    const results = await this.roleService.getAllPaginate(
      parseInt(param.page),
      parseInt(param.size),
      param.orderBy,
      param.orderDirection,
      param.search,
    );
    return {
      results: results[0],
      total: results[1],
    };
  }

  @Get()
  async getAll() {
    return await this.roleService.findAll();
  }
  @Get(':id')
  async getById(@Param() param) {
    return await this.roleService.findById(param.id);
  }

  @Post()
  async create(@Body() body: RoleDTO) {
    return await this.roleService.create(body);
  }

  @Put(':id')
  async update(@Param() param, @Body() body: RoleDTO) {
    return await this.roleService.update(param.id, body);
  }

  @Delete(':id')
  async delete(@Param() param) {
    return await this.roleService.delete(param.id);
  }

  @Put('assign')
  async assign(@Body() body: { roleId: number; routeId: number }) {
    return await this.roleService.assign(body.roleId, body.routeId);
  }
}
