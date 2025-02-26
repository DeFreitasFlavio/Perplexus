import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guards';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guards';
import { AuthService } from '../../auth/services/auth.service';
import { createUsersDto } from '../dto/users.dto';
import { loginUsersDto } from '../dto/login.dto';
import { UsersServices } from '../services/users.service';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

@Controller('users')
export class UsersController {
  constructor(
    private userServices: UsersServices,
    private authService: AuthService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post('auth/sign-up')
  async signup(@Body() createUserDto: createUsersDto): Promise<createUsersDto> {
    return await this.userServices.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() loginUserDto: loginUsersDto) {
    if (
      this.authService.validateUser(loginUserDto.email, loginUserDto.password)
    ) {
      return this.authService.login(
        await this.userServices.findByEmail(loginUserDto.email),
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Request() req) {
    return req.user;
  }

  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    let user = await this.userServices.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.userServices.getUsers();
  }
}
