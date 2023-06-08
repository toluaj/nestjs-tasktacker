import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SearchTodoInput {
  @Field()
  searchQuery: string;
}
