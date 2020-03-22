import { IsNotEmpty } from 'class-validator';
import { Route } from 'src/route/route.entity';

export class RoleDTO {
  id?: number;

  @IsNotEmpty()
  name: string;

  routes: Route[];
}
