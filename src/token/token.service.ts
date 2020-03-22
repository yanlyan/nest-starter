import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Token } from './token.entity';
import { TokenDto } from './token.dto';
import { subYears, addDays, addYears } from 'date-fns';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  findAll(): Promise<Token[]> {
    return this.tokenRepository.find();
  }

  async create(data: TokenDto): Promise<Token> {
    data.validUntil = addDays(new Date(), 5);
    const token = this.tokenRepository.create(data);
    await this.tokenRepository.save(token);
    return token;
  }

  async update(id: string, data: Partial<TokenDto>): Promise<Token> {
    await this.tokenRepository.update({ id }, data);
    return await this.tokenRepository.findOne({
      where: { id },
    });
  }

  findOne(id: string): Promise<Token> {
    return this.tokenRepository.findOne(id, { relations: ['user'] });
  }

  findValid(id: string): Promise<Token> {
    return this.tokenRepository.findOne(id, {
      where: {
        isRevoked: false,
        validUntil: Between(new Date(), addYears(new Date(), 100)),
      },
      relations: ['user'],
    });
  }

  findValidByUser(userId): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        isRevoked: 0,
      },
      relations: ['user'],
    });
  }

  async invalidateToken(): Promise<any> {
    return this.tokenRepository.update(
      {
        validUntil: Between(subYears(new Date(), 100), new Date()),
        isRevoked: false,
      },
      { isRevoked: true },
    );
  }

  async revokeToken(token): Promise<any> {
    return this.tokenRepository.update(
      {
        id: token,
      },
      {
        isRevoked: true,
      },
    );
  }

  async remove(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
