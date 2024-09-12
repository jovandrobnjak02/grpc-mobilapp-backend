import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  account_name: string;

  @OneToMany(() => User, (user) => user.account)
  users: User[];
}
