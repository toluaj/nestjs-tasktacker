import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
