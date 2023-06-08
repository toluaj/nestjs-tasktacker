import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => Int, { description: 'The unique identifier of a task/to-do.' })
  id: number;

  @Field({ description: 'The name of a task/to-do.' })
  title: string;

  @Field({ description: 'More details on a task/to-do', nullable: true })
  description?: string;

  @Field({ description: 'The status of a task/to-do', defaultValue: false })
  completed: boolean;
}
