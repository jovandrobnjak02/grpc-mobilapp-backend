import { User } from '../../auth/entities/user.entity';
import { RunStatus } from '../../constants/run-status';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Run {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  assigned_driver: string;

  @Column({ nullable: false })
  assigned_vehicle: string;

  @Column({ type: 'enum', nullable: false, enum: RunStatus })
  status: RunStatus;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Item, (item) => item.run)
  items: Item[];
}
