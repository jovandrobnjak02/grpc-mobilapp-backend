import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Item } from './entities/item.entity';
import { RunIdDto } from './dtos/run-id.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RunService {
  constructor(private databaseService: DatabaseService) {}

  async getRuns(user_id: number) {
    const runs = await this.databaseService.findRuns(user_id);
    let count = 0;
    if (runs) {
      return runs.map((run) => {
        count += 1;
        return {
          reference: run.id,
          start_date: {
            seconds: run.start_time.getTime(),
            nanos: run.start_time.getMilliseconds() * 1000000,
          },
          vehicle_name: run.assigned_driver,
          driver_name: run.assigned_vehicle,
          status: run.status,
          number: count,
        };
      });
    }

    return [];
  }

  async getRunItems(data: RunIdDto) {
    if (!data.reference) {
      throw new RpcException({ message: 'Missing RunId', code: 3 });
    }
    // const items = await this.databaseService.findItems(data.runId);

    // if (items) {
    //   return items
    //     .map((item) => {
    //       return {
    //         ...item,
    //         name: item.item_name,
    //         scans: this.filterScans(item),
    //       };
    //     })
    //     .sort((a, b) => a.stop - b.stop);
    // }

    const run = await this.databaseService.findRun(data.reference);

    return {
      summary: {
        reference: run.id,
        start_date: {
          seconds: run.start_time.getTime(),
          nanos: run.start_time.getMilliseconds() * 1000000,
        },
        vehicle_name: run.assigned_driver,
        driver_name: run.assigned_vehicle,
        status: run.status,
        number: 1,
      },
      items: [],
    };
  }

  filterScans(item: Item) {
    return item.codes.reduce((count, code) => {
      if (code.scanned) {
        count += 1;
      }
      return count;
    }, 0);
  }

  async createNewPopulatedRun() {
    const res = await this.databaseService.insertNewRunWithItems();

    if (!res) {
      throw new RpcException({ message: 'Failed to create new run', code: 13 });
    }
  }
}
