import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Role])],
  providers: [RouteService],
  exports: [RouteService],
  controllers: [RouteController],
})
export class RouteModule {}
