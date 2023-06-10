import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from '../users/dto/login-user.input';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        UsersService,
        JwtService,
        PrismaService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('login should return a token when a valid username and password are provided', async () => {
    const loginUserInput: LoginUserInput = {
      username: 'testuser',
      password: 'password123',
    };
    const token = 'mockedtoken';

    const mockFindByUsername = jest
      .spyOn(usersService, 'findByUsername')
      .mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
      });

    const mockLogin = jest.spyOn(authService, 'login').mockResolvedValue(token);

    const result = await resolver.login(loginUserInput);

    expect(mockFindByUsername).toHaveBeenCalledWith(
      loginUserInput.username.trim(),
    );

    expect(mockLogin).toHaveBeenCalledWith(loginUserInput);

    expect(result).toBe(token);
  });

  it('login should throw an error when an invalid username is provided', async () => {
    const loginUserInput: LoginUserInput = {
      username: 'nonexistentuser',
      password: 'password123',
    };

    jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
    await expect(resolver.login(loginUserInput)).rejects.toThrow(
      'User not found',
    );
  });
});
