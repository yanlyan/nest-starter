import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RoleService } from 'src/role/role.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ACLMiddleware implements NestMiddleware {
  constructor(private roleService: RoleService) {}
  async use(req: Request, res: Response, next: Function) {
    if (req.user) {
      const role = await this.roleService.findById((req.user as Users).role.id);
      const route = role.routes.filter(r => {
        if (r.isRegex) {
          if (req.baseUrl.match(r.path) !== null && r.method === req.method) {
            return true;
          }
          return false;
        } else {
          if (req.baseUrl === r.path && r.method === req.method) {
            return true;
          }
          return false;
        }
      });
      if (route.length === 0) {
        throw new UnauthorizedException(
          'Your role is not eligible for this action/menu',
        );
      }
    }

    next();
  }
}
