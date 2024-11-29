import { Injectable } from '@nestjs/common';
import { UsersServices } from '../../../users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersServices,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
