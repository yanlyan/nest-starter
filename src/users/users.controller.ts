import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersDto } from './users.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('paginate')
  async getAllPaginate(@Query() param: any) {
    const results = await this.userService.getAllPaginate(
      parseInt(param.page),
      parseInt(param.size),
      param.orderBy,
      param.orderDirection,
      param.search,
      param.roleId,
    );
    return {
      results: results[0],
      total: results[1],
    };
  }

  @Get(':id')
  async getById(@Param('id') id) {
    return await this.userService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.userService.delete(id);
  }

  @Post()
  async create(@Body() body: UsersDto) {
    return await this.userService.create(body);
  }
  @Put(':id')
  async update(@Param('id') id, @Body() body: UsersDto) {
    return await this.userService.update(id, body);
  }
}
