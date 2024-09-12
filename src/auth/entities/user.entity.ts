import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  user_name: string;

  @Column({ nullable: false })
  password_hash: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;
}
