import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService, PrismaService, JwtService],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a new user with hashed password', async () => {
    const createUserInput = { username: 'testuser', password: 'password123' };

    const createUserSpy = jest
      .spyOn(usersService, 'createUser')
      .mockImplementation(async (input) => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(input.password, salt);
        return {
          id: 1,
          username: input.username,
          password: hashedPassword,
        };
      });

    const result = await resolver.createUser(createUserInput);

    expect(createUserSpy).toHaveBeenCalledWith(createUserInput);

    expect(result.id).toBe(1);
    expect(result.username).toBe(createUserInput.username);
    expect(
      await bcrypt.compare(createUserInput.password, result.password),
    ).toBe(true);
  });

  it('registerUser should throw an error when the username already exists', async () => {
    const createUserInput = {
      username: 'existinguser',
      password: 'password123',
    };

    const mockFindByUsername = jest
      .spyOn(usersService, 'findByUsername')
      .mockResolvedValue({ id: 1, username: 'existiuser' } as any);

    await expect(resolver.createUser(createUserInput)).rejects.toThrow(
      'This username already exists.',
    );

    expect(mockFindByUsername).toHaveBeenCalledWith(createUserInput.username);
  });
});
