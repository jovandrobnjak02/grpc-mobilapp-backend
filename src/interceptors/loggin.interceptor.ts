import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    Logger.log(`[${context.getHandler().name}] called`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `[${context.getHandler().name}] Finished the request in ${
            Date.now() - now
          }ms`,
        );
      }),
      catchError((error) => {
        Logger.error(`[${context.getHandler().name}] Error: ${error.message}`);

        return throwError(() => error);
      }),
    );
  }
}
