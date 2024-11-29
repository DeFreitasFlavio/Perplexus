import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
    minLength: 8,
  })
  password: string;
}
