import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from './token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post()
  create(@Body() body: TokenDto) {
    this.tokenService.create(body);
  }
}
