import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  UseGuards,
  Request,
  Get,
  Query,
  Post,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guards';
import { LeaderboardService } from '../services/leaderboard.service';
import { CreateScoreDto } from '../dto/create-score.dto';
import { LeaderboardQueryDto } from '../dto/leaderboard.dto';

@ApiTags('leaderboard')
@ApiBearerAuth('JWT-auth')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @UseGuards(LocalAuthGuard)
  @Post('score')
  @ApiOperation({ summary: 'Add a new score' })
  @ApiResponse({ status: 201, description: 'Score added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addScore(@Request() req, @Body() createScoreDto: CreateScoreDto) {
    console.log('User from token:', req.user); // Vérifier les données du token
    console.log('Score data:', createScoreDto); // Vérifier les données envoyées
    return this.leaderboardService.addScore(req.user.Id, createScoreDto);
  }

  @UseGuards(LocalAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiResponse({ status: 200, description: 'Return leaderboard' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getLeaderboard(@Query() query: LeaderboardQueryDto) {
    return this.leaderboardService.getLeaderboard(query);
  }
}
