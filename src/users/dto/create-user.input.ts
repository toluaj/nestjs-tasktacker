import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'Username of the user.' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field({ description: 'Username of the user.' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
