import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from '../users/dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserById(userId: number): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async login(loginUserInput: LoginUserInput) {
    const { username, password } = loginUserInput;
    const user = await this.usersService.findByUsername(username.trim());
    if (!user) {
      throw new NotFoundException('User with this username does not exist.');
    }
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { id: user.id, username: user.username, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }
}
