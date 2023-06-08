import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import {
  CreateTodoInput,
  PaginationArgs,
  SearchTodoInput,
  UpdateTodoInput,
} from './dto';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  create(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.create(createTodoInput);
  }

  @Query(() => [Todo], { name: 'getTodos' })
  findAll(@Args() paginationArgs?: PaginationArgs) {
    return this.todoService.findAll(paginationArgs);
  }

  @Query(() => Todo, { name: 'todo' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.todoService.findOne(id);
  }

  @Query(() => [Todo], { name: 'searchTitleDesc' })
  searchTitleDesc(@Args('searchTodoInput') searchTodoInput: SearchTodoInput) {
    return this.todoService.searchTitleDesc(searchTodoInput.searchQuery);
  }

  @Mutation(() => Todo)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.remove(id);
  }
}
