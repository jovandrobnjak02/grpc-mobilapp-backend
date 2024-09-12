import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}
  async validateUser(data: LoginDto) {
    if (!data.account) {
      throw new RpcException({
        message: 'Missing account',
        code: 16,
      });
    }
    if (!data.password) {
      throw new RpcException({
        message: 'Missing password',
        code: 16,
      });
    }
    if (!data.username) {
      throw new RpcException({
        message: 'Missing username',
        code: 16,
      });
    }
    const user = await this.databaseService.findUser(data.username);
    const account = await this.databaseService.findAccount(data.account);

    if (!account) {
      throw new RpcException({ message: 'Account not found', code: 5 });
    }

    if (!user) {
      throw new RpcException({ message: 'User not found', code: 5 });
    }
    if (!(await bcrypt.compare(data.password, user.password_hash))) {
      throw new RpcException({ message: 'Wrong password', code: 16 });
    }

    return this.generateTokens(user.id, user.user_name);
  }

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: 'loaderappsecret',
    });
  }

  generateTokens(user_id: number, username: string) {
    return {
      access_token: this.jwtService.sign({
        user_id: user_id,
        username: username,
      }),
      refresh_token: this.jwtService.sign(
        {
          user_id: user_id,
          username: username,
        },
        { expiresIn: '7d' },
      ),
      token_type: 'ACCESS',
      expires_in: {
        seconds: 300,
        nanos: 15,
      },
    };
  }

  async refreshToken(data: RefreshTokenDto) {
    if (!data.refresh_token) {
      throw new RpcException({ message: 'No token found!', code: 16 });
    }

    try {
      await this.validateToken(data.refresh_token);
      const payload = this.jwtService.decode(data.refresh_token);
      const tokens = this.generateTokens(
        payload['user_id'],
        payload['username'],
      );

      return {
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      };
    } catch (error: any) {
      Logger.error(error);
      throw new RpcException({ message: 'Unauthorized access!', code: 16 });
    }
  }
}
