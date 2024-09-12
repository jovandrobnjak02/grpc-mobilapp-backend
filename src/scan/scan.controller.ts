/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, UseGuards } from '@nestjs/common';
import { ScanService } from './scan.service';
import { AuthGuard } from '../auth/auth.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { ItemCodeDto } from './dto/item-code.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller()
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @GrpcMethod('ScanService', 'ScanItem')
  @UseGuards(AuthGuard)
  async scanItem(
    data: ItemCodeDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    return await this.scanService.scanItemCode(data.code);
  }
}
