import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const { username, password } = createUserInput;
    const usernameExists = await this.findByUsername(username);
    if (usernameExists)
      throw new ConflictException('This username already exists.');
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const user = await this.prisma.user.create({
        data: { password: hashedPassword, username },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Failed to create user.');
      }
      throw error;
    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Failed to find user.');
      }
      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Failed to find user.');
      }
      throw error;
    }
  }
}
