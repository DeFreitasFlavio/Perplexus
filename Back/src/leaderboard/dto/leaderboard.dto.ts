import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LeaderboardQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsString()
  sortBy?: 'score' | 'levelsCompleted' | 'timeSpent' = 'score';
}

export class ScoreResponseDto {
  @ApiProperty({
    description: 'Identifiant unique du score',
    example: 'uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Score obtenu par le joueur',
    example: 1000,
  })
  score: number;

  @ApiProperty({
    description: 'Numéro du niveau complété',
    example: 1,
  })
  levelCompleted: number;

  @ApiProperty({
    description: 'Temps passé en secondes',
    example: 120,
  })
  timeSpent: number;

  @ApiProperty({
    description: 'Date de création du score',
    example: '2023-11-28T12:34:56.789Z',
  })
  createdAt: Date;
}
