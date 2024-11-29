import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty({
    description: 'Score obtenu par le joueur',
    example: 1000,
    type: Number,
    required: true,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    description: 'Numéro du niveau complété',
    example: 1,
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  levelCompleted: number;

  @ApiProperty({
    description: 'Temps passé en secondes',
    example: 120,
    type: Number,
    required: true,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  timeSpent: number;
}
