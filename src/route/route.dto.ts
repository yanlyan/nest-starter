import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/role/role.entity';

export class RouteDTO {
  id?: number;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  method: string;

  isRegex?: boolean;

  roles: Role[];
}
