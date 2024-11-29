import { forwardRef, Module } from '@nestjs/common';
import { LeaderboardService } from './services/leaderboard.service';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score, User } from './entity/score.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Score, User]), UserModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
