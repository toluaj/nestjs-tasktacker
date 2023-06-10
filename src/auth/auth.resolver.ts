import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from '../users/dto/login-user.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => String)
  async login(@Args('data') loginUserInput: LoginUserInput) {
    const user = await this.usersService.findByUsername(
      loginUserInput.username,
    );
    if (!user) {
      throw new Error('User not found');
    }

    return this.authService.login(loginUserInput);
  }
}
