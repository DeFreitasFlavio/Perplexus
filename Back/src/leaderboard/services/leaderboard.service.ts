import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score, User } from '../entity/score.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateScoreDto } from '../dto/create-score.dto';
import { LeaderboardQueryDto } from '../dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addScore(userId: string, createScoreDto: CreateScoreDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const score = this.scoreRepository.create({
      ...createScoreDto,
      user: user,
    });

    return this.scoreRepository.save(score);
  }

  async getLeaderboard(query: LeaderboardQueryDto) {
    const { limit, page, sortBy } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'totalScore', 'levelsCompleted'],
      order: {
        [sortBy]: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['totalScore', 'levelsCompleted'],
    });

    const ranking = await this.userRepository.count({
      where: {
        totalScore: MoreThan(user.totalScore),
      },
    });

    return {
      ...user,
      ranking: ranking + 1,
    };
  }
}
