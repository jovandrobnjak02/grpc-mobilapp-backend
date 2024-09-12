/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  @GrpcMethod('LoaderService', 'Login')
  async login(
    data: LoginDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const token = await this.authService.validateUser(data);
    return token;
  }

  @GrpcMethod('LoaderService', 'Refresh')
  async refreshToken(
    data: RefreshTokenDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    return await this.authService.refreshToken(data);
  }
  @GrpcMethod('LoaderService', 'Logout')
  async logout(data, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    this.eventEmitter.emit('logout', () => {
      Logger.log('Emitted the event');
    });
  }
}
