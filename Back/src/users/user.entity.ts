import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Score } from '../leaderboard/entity/score.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string; //au format uuidv4

  @Column({ unique: true })
  public username!: string; // cette propriété doit porter une contrainte d'unicité

  @Column({ unique: true })
  @IsEmail()
  public email!: string; // cette propriété doit porter une contrainte d'unicité

  @Column()
  public password!: string;

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  levelsCompleted: number;
}
