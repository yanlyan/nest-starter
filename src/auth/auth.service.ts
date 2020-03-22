import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AES } from 'crypto-ts';
import { TokenService } from 'src/token/token.service';
import { TokenType } from 'src/token/token.entity';
import { Users } from 'src/users/users.entity';
import { compareSync } from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException("Password doesn't match");
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }

  async login(user: Users) {
    const payload = {
      username: user.username || user.email,
      sub: user.id,
      type: 'access_token',
    };
    return {
      token: this.jwtService.sign(payload),
      refreshToken: await this.createRefreshToken(user),
    };
  }

  async generateNewToken(refreshToken: string, userId) {
    let found = await this.tokenService.findValid(refreshToken);
    if (found) {
      const payload = {
        username: found.user.username,
        sub: found.user.id,
        type: 'access_token',
      };
      await this.tokenService.update(found.id, { isRevoked: true });
      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: await this.createRefreshToken(found.user),
      };
    } else {
      found = await this.tokenService.findValidByUser(userId);
      if (found) {
        const payload = {
          username: found.user.username,
          sub: found.user.id,
          type: 'access_token',
        };
        return {
          access_token: this.jwtService.sign(payload),
          refreshToken: AES.encrypt(found.id, jwtConstants.secret).toString(),
        };
      }
    }
    return null;
  }

  async createRefreshToken(user) {
    const refreshToken = await this.tokenService.create({
      type: TokenType.JWT_REFRESH_TOKEN,
      isRevoked: false,
      user: user,
    });
    return AES.encrypt(refreshToken.id, jwtConstants.secret).toString();
  }
}
