import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { RouteDTO } from './route.dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('paginate')
  async getAllPaginate(@Query() param: any) {
    const results = await this.routeService.getAllPaginate(
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
    return await this.routeService.getAll();
  }

  @Get(':id')
  async getById(@Param() param) {
    return await this.routeService.findById(param.id);
  }

  @Post()
  async create(@Body() body: RouteDTO) {
    return await this.routeService.create(body);
  }

  @Put(':id')
  async update(@Param() param, @Body() body: RouteDTO) {
    return await this.routeService.update(param.id, body);
  }

  @Delete(':id')
  async delete(@Param() param) {
    return await this.routeService.delete(param.id);
  }
}
