import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  score: number;

  @Column()
  levelCompleted: number;

  @Column()
  timeSpent: number;

  @CreateDateColumn()
  createdAt: Date;
}
export { User };
