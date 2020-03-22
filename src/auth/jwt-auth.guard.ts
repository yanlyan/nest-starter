import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log(err);
    if (info instanceof TokenExpiredError) {
      // console.log(info);
      throw new UnauthorizedException({
        type: 'token_expired',
        message: 'Token Expired',
      });
    } else if (info) {
      throw new UnauthorizedException();
    } else if (err) {
      throw err;
    }
    return user;
  }
}
