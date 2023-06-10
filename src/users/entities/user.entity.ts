import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => Int, {
    description: 'The unique identifier of a user.',
  })
  id: number;

  @Field({ description: 'Username of the user.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  username: string;
}
