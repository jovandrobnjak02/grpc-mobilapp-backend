import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc().getContext();
    const auth = rpcContext.internalRepr.get('authorization');

    if (!auth) {
      throw new RpcException({ message: 'Missing auth header!', code: 16 });
    }

    const token = auth[0]?.split(' ')[1] || null;

    if (!token) {
      throw new RpcException({ message: 'No token found!', code: 16 });
    }

    try {
      const payload = await this.authService.validateToken(token);

      rpcContext['user'] = payload;
    } catch (error: any) {
      Logger.error(error);
      throw new RpcException({ message: 'Unauthorized access!', code: 16 });
    }
    return true;
  }
}
