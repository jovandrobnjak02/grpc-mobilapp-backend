import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Code } from './code.entity';
import { Run } from './run.enitity';

@Entity()
export class Item {
  @PrimaryColumn()
  id: string;

  @Column()
  item_name: string;

  @Column()
  stop: number;

  @Column()
  checked: boolean;

  @OneToMany(() => Code, (code) => code.item)
  codes: Code[];

  @ManyToOne(() => Run, (run) => run.items)
  run: Run;
}
