import { Module } from '@nestjs/common';
import { TokenInvalidateTask } from './token-invalidate.task';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  providers: [TokenInvalidateTask],
})
export class CronModule {}
