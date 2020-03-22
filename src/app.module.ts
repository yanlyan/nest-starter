import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { RoleModule } from './role/role.module';

import { Product } from './product/product.entity';
import { Users } from './users/users.entity';
import { Token } from './token/token.entity';
import { Role } from './role/role.entity';

import { JWTMiddleware } from './auth/jwt.middleware';
import { jwtConstants } from './auth/constants';
import { ACLMiddleware } from './auth/acl.middleware';

import configuration from './config/configuration';
import { CronModule } from './crons/cron.module';
import { RouteModule } from './route/route.module';
import { Route } from './route/route.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [Product, Users, Token, Role, Route],
        synchronize: true,
        keepConnectionAlive: true,
        // logging: configService.get<string>('env') === 'development',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    AuthModule,
    UsersModule,
    TokenModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
    RoleModule,
    ScheduleModule.forRoot(),
    CronModule,
    RouteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware, ACLMiddleware).forRoutes('*');
  }
}
