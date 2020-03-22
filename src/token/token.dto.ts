import { TokenType } from './token.entity';
import { Users } from '../users/users.entity';
import { IsNotEmpty, IsBoolean, IsDate } from 'class-validator';
export class TokenDto {
  id?: string;

  @IsNotEmpty()
  type: TokenType;

  @IsNotEmpty()
  @IsBoolean()
  isRevoked: boolean;

  @IsNotEmpty()
  user?: Users;

  @IsDate()
  validUntil?: Date;
}
