import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Todo } from './todo.entity';

@ObjectType()
export class TodoFeed {
  @Field(() => [Todo])
  todos: Todo[];

  @Field(() => Int)
  count: number;
}
