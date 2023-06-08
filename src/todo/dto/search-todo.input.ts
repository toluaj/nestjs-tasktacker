import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SearchTodoInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  searchQuery: string;
}
