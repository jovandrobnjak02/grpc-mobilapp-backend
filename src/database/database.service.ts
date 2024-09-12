import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../auth/entities/account.entity';
import { Run } from '../run/entities/run.enitity';
import { Item } from '../run/entities/item.entity';
import generateRandomNumberString from '../utils/generate-random-number';
import generateRandomLetterString from '../utils/generate-random-letters';
import { RunStatus } from '../constants/run-status';
import { Code } from '../run/entities/code.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Run) private runRepository: Repository<Run>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Code) private codeRepository: Repository<Code>,
    private dataSource: DataSource,
  ) {}

  findUser(user_name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ user_name });
  }

  findAccount(account_name: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ account_name });
  }

  findRuns(user_id: number): Promise<Run[] | null> {
    return this.runRepository.find({
      where: {
        users: {
          id: user_id,
        },
      },
    });
  }

  findItems(run_id: string) {
    return this.itemRepository.find({
      where: {
        run: {
          id: run_id,
        },
      },
      relations: ['codes'],
    });
  }
  findRun(run_id: string) {
    return this.runRepository.findOneBy({ id: run_id });
  }
  async insertNewRunWithItems() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const newRun = await this.saveNewRun();
      await this.saveNewItem(newRun);
      await this.saveNewItem(newRun, 1);
      await this.saveNewItem(newRun, 2);

      await queryRunner.commitTransaction();

      return true;
    } catch (err) {
      Logger.error(err);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async saveNewRun(userId = 1) {
    let runId = generateRandomLetterString(9);
    const existingRunIds = (await this.runRepository.find()).map(
      (run) => run.id,
    );

    while (existingRunIds.includes(runId)) {
      runId = generateRandomNumberString(9);
    }
    const startTime = new Date(Date.now() + 40);
    const run = new Run();
    run.id = runId;
    run.start_time = startTime;
    run.location = 'Apt. 428 555 Denita Way, Erdmanshire';
    run.assigned_driver = 'John Snow';
    run.assigned_vehicle = '2023 Ford Transit 350';
    run.status = RunStatus.LOADER_RUN_CHANGE_TYPE_RUN_CREATED;
    run.users = [await this.userRepository.findOne({ where: { id: userId } })];

    await this.dataSource.manager.save(run);

    return run;
  }

  async saveNewItem(run: Run, stop = 1) {
    let itemId = generateRandomLetterString(7);
    const existingItemIdS = (await this.itemRepository.find()).map(
      (item) => item.id,
    );

    while (existingItemIdS.includes(itemId)) {
      itemId = generateRandomNumberString(9);
    }

    const code1 = await this.saveNewCode();
    const code2 = await this.saveNewCode();
    const item = new Item();
    item.id = itemId;
    item.item_name = `ITEM_${itemId[0].toUpperCase()}`;
    item.run = run;
    item.stop = stop;
    item.checked = false;
    item.codes = [code1, code2];
    this.dataSource.manager.save(item);

    return item;
  }

  async saveNewCode() {
    let codeString = generateRandomNumberString(8);
    const existingCodes = (await this.codeRepository.find()).map(
      (code) => code.code,
    );

    while (existingCodes.includes(codeString)) {
      codeString = generateRandomNumberString(9);
    }

    const code = new Code();
    code.code = codeString;
    code.scanned = false;
    await this.dataSource.manager.save(code);

    return code;
  }

  async checkItemCode(code: string) {
    const codeObj = await this.codeRepository.findOne({
      where: {
        code: code,
      },
    });
    if (!codeObj) {
      return null;
    } else if (codeObj.scanned) {
      throw new RpcException({ message: 'Code already scanned!', code: 13 });
    }
    return codeObj;
  }

  async markAsScanned(code: Code) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .update(Code)
        .set({ scanned: true })
        .where('id = :id', { id: code.id })
        .execute();

      const item = await this.itemRepository.findOne({
        where: {
          codes: {
            code: code.code,
          },
        },
      });
      const run = await this.runRepository.findOne({
        where: {
          items: {
            id: item.id,
          },
        },
      });
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .update(Run)
        .set({ status: 'IN_PROGRESS' })
        .where('id = :id', { id: run.id })
        .execute();

      await queryRunner.commitTransaction();
      await this.checkIfItemIsChecked(item);
      await this.checkIfRunIsFinished(run);
      return item;
    } catch (err) {
      Logger.error(err);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async checkIfItemIsChecked(item: Item) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const res = await this.codeRepository.exists({
        where: {
          scanned: false,
          item: {
            id: item.id,
          },
        },
      });
      Logger.log(`Found not scanned codes for ${item.id}: ${res}`);
      if (!res) {
        await this.dataSource
          .createQueryBuilder(queryRunner)
          .update(Item)
          .set({ checked: true })
          .where('id = :id', { id: item.id })
          .execute();
      }
      await queryRunner.commitTransaction();

      return item;
    } catch (err) {
      Logger.error(err);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async checkIfRunIsFinished(run: Run) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const uncheckedItems = await this.itemRepository.exists({
        where: {
          checked: false,
          run: {
            id: run.id,
          },
        },
      });
      if (!uncheckedItems) {
        await this.dataSource
          .createQueryBuilder(queryRunner)
          .update(Run)
          .set({ status: 'COMPLETED' })
          .where('id = :id', { id: run.id })
          .execute();
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error(err);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }
}
