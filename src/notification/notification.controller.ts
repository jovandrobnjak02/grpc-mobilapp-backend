/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/auth.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerWritableStream } from '@grpc/grpc-js';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationType } from '../constants/notification-type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
  ) {}

  @GrpcMethod('LoaderService', 'EventStream')
  @UseGuards(AuthGuard)
  async notify(
    data,
    metadata: Metadata,
    call: ServerWritableStream<any, NotificationDto>,
  ) {
    call.write({
      type: NotificationType.API_EVENT_TYPE_UNSPECIFIED,
      timestamp: {
        seconds: new Date().getTime(),
        nanos: new Date().getMilliseconds() * 1000000,
      },
    });

    await new Promise<void>((resolve) => {
      const concurrentLogin = () => {
        Logger.log('Received event');
        const date = new Date();
        call.write({
          type: NotificationType.API_EVENT_TYPE_CONCURRENT_LOGIN,
          timestamp: {
            seconds: date.getTime(),
            nanos: date.getMilliseconds() * 1000000,
          },
        });
      };

      const onRunsNew = () => {
        Logger.log('Received event');
        const date = new Date();
        call.write({
          type: NotificationType.API_EVENT_TYPE_RUN_LIST_UPDATED,
          timestamp: {
            seconds: date.getTime(),
            nanos: date.getMilliseconds() * 1000000,
          },
        });
      };
      const unspecifiedNotification = () => {
        Logger.log('Received event');
        const date = new Date();
        call.write({
          type: NotificationType.API_EVENT_TYPE_UNSPECIFIED,
          timestamp: {
            seconds: date.getTime(),
            nanos: date.getMilliseconds() * 1000000,
          },
        });
      };

      this.eventEmitter.on('run.reset', concurrentLogin);
      this.eventEmitter.on('run.created', onRunsNew);
      this.eventEmitter.on('unspecified', unspecifiedNotification);
      this.eventEmitter.on('logout', resolve);
      call.on('finish', resolve);
    });
  }
}
