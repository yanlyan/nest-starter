import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { RoleDTO } from 'src/role/role.dto';

export class UsersDto {
  id?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty()
  role: RoleDTO;
}
