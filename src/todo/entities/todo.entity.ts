import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => Int, {
    description: 'The unique identifier of a task or to-do item.',
  })
  id: number;

  @Field({ description: 'The name or title of a task or to-do item.' })
  title: string;

  @Field({
    description: 'Additional details or description of a task or to-do item.',
    nullable: true,
  })
  description?: string;

  @Field({
    description:
      'The status of a task or to-do item (whether it is completed or not).',
    defaultValue: false,
  })
  completed: boolean;
}
