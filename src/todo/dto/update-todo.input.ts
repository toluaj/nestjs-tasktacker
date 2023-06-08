import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTodoInput } from './create-todo.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field(() => Int)
  @IsNotEmpty({ message: 'ID must be provided.' })
  id: number;

  @Field()
  @IsNotEmpty({ message: 'Title must be provided.' })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}
