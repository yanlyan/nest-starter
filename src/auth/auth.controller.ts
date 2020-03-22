import { Controller, UseGuards, Post, Request, Delete } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AES, enc } from 'crypto-ts';
import { jwtConstants } from './constants';
import { TokenService } from 'src/token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email);
    return this.authService.login(user);
  }

  @Delete('revoke')
  async revoke(@Request() req) {
    const bytes = AES.decrypt(
      req.headers['refresh-token'].toString(),
      jwtConstants.secret,
    );
    const refreshToken = bytes.toString(enc.Utf8);
    return await this.tokenService.revokeToken(refreshToken);
  }
}
