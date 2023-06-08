import { Injectable } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetTodosArgs } from './dto/get-todo.input';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  createTodo(createTodoInput: CreateTodoInput) {
    if (!createTodoInput.title)
      throw new Error('You must provide a title for your to-do!');
    return this.prisma.todo.create({ data: { ...createTodoInput } });
  }

  findAll(getTodosArgs: GetTodosArgs) {
    return this.prisma.todo.findMany(getTodosArgs);
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('This to-do does not exist.');
    return todo;
  }

  async searchTitleDesc(searchQuery: string) {
    if (!searchQuery) throw new Error('You have to provide a search query.');
    return await this.prisma.todo.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
            },
          },
          {
            description: {
              contains: searchQuery,
            },
          },
        ],
      },
    });
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    return this.prisma.todo.update({
      where: { id },
      data: { ...updateTodoInput },
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } });
  }
}
