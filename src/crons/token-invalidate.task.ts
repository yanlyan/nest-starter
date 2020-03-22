import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class TokenInvalidateTask {
  constructor(private readonly tokenService: TokenService) {}
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.tokenService
      .invalidateToken()
      .then()
      .catch();
  }
}
