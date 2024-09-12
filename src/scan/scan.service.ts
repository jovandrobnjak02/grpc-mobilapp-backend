import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ScanService {
  constructor(private databaseService: DatabaseService) {}
  async scanItemCode(code: string) {
    if (!code) {
      throw new RpcException({ message: 'Missing item code', code: 3 });
    }
    const codeEnt = await this.databaseService.checkItemCode(code);

    if (!codeEnt) {
      throw new RpcException({ message: 'Item code not found', code: 5 });
    }

    const res = await this.databaseService.markAsScanned(codeEnt);
    if (!res) {
      throw new RpcException({ message: 'Unabled to scan item', code: 5 });
    }

    return { id: res.id, stop: res.stop, name: res.item_name };
  }
}
