import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { AES, enc } from 'crypto-ts';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  excluded: string[] = ['/auth/login'];
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: Function) {
    if (this.excluded.includes(req.baseUrl)) {
      return next();
    }
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      try {
        this.jwtService.verify(token);
        const decoded = this.jwtService.decode(token);
        const user = await this.userService.findById(decoded.sub);
        req.user = user;
        return next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          const bytes = AES.decrypt(
            req.headers['refresh-token'].toString(),
            jwtConstants.secret,
          );
          const refreshToken = bytes.toString(enc.Utf8);
          const decoded = this.jwtService.decode(token);
          const newToken = await this.authService.generateNewToken(
            refreshToken,
            decoded.sub,
          );
          if (!newToken) {
            res.setHeader('logout', '1');
            throw new UnauthorizedException(
              {
                type: 'refresh_token_invalid',
                message: 'Refresh Token Invalid',
              },
              'Refresh Token Invalid',
            );
          }
          req.headers.authorization = `Bearer ${newToken.access_token}`;
          req.headers['refresh-token'] = newToken.refreshToken;
          req.user = await this.userService.findById(decoded.sub);
          res.setHeader('token', newToken.access_token);
          res.setHeader('refresh-token', newToken.refreshToken);
          res.setHeader('access-control-expose-headers', [
            'token',
            'refresh-token',
          ]);
          return next();
        } else {
          throw error;
        }
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
