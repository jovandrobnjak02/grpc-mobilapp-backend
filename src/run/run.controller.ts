/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { RunService } from './run.service';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { RunIdDto } from './dtos/run-id.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class RunController {
  constructor(
    private readonly runService: RunService,
    private eventEmitter: EventEmitter2,
  ) {}

  @GrpcMethod('LoaderService', 'GetRuns')
  @UseGuards(AuthGuard)
  async getRuns(data, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    const runs = await this.runService.getRuns(metadata['user']['user_id']);

    return { runs };
  }

  @GrpcMethod('LoaderService', 'GetRun')
  @UseGuards(AuthGuard)
  async getRunItems(
    data: RunIdDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const items = await this.runService.getRunItems(data);

    return { run: items };
  }
}
