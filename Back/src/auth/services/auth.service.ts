import { Injectable } from '@nestjs/common';
import { UsersServices } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersServices: UsersServices,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersServices.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
