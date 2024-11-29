import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
    minLength: 3,
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
    minLength: 8,
  })
  password: string;
}
