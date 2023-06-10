import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import {
  CreateTodoInput,
  PaginationArgs,
  SearchTodoInput,
  UpdateTodoInput,
} from './dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.gaurd';
import { UserContext } from '../users/users-decorator';
import { TodoFeed } from './entities/todofeed.entity';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Todo)
  createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @UserContext() context: any,
  ) {
    return this.todoService.create(createTodoInput, context);
  }

  @UseGuards(AuthGuard)
  @Query(() => [TodoFeed], { name: 'getTodos' })
  async findAll(
    @UserContext() context: any,
    @Args({ nullable: true }) paginationArgs?: PaginationArgs,
  ) {
    if (paginationArgs) {
      const { take, skip } = paginationArgs;

      if ((take && (take < 1 || take > 50)) || (skip && skip < 0)) {
        throw new BadRequestException('Invalid pagination arguments');
      }
    }

    const todos = await this.todoService.findAll(paginationArgs, context);

    return [
      {
        todos,
        count: todos.length,
      },
    ];
  }

  @UseGuards(AuthGuard)
  @Query(() => Todo, { name: 'todo' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @UserContext() context: any,
  ) {
    return await this.todoService.findOne(id, context);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Todo], { name: 'searchTitleDesc' })
  async searchTitleDesc(
    @Args('searchTodoInput') searchTodoInput: SearchTodoInput,
    @UserContext() context: any,
  ) {
    return await this.todoService.searchTitleDesc(
      searchTodoInput.searchQuery,
      context,
    );
  }

  @Mutation(() => Todo)
  updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @UserContext() context: any,
  ) {
    return this.todoService.update(
      updateTodoInput.id,
      updateTodoInput,
      context,
    );
  }

  @Mutation(() => Todo)
  removeTodo(
    @Args('id', { type: () => Int }) id: number,
    @UserContext() context: any,
  ) {
    return this.todoService.remove(id, context);
  }
}
