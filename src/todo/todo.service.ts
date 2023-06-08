import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInput, UpdateTodoInput, PaginationArgs } from './dto';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  create(createTodoInput: CreateTodoInput) {
    if (!createTodoInput.title)
      throw new Error('Please provide a title for your to-do!');
    return this.prisma.todo.create({ data: { ...createTodoInput } });
  }

  findAll(paginationArgs?: PaginationArgs) {
    return this.prisma.todo.findMany(paginationArgs);
  }

  async findOne(id: number) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to find a to-do.');
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('No to-do found with the specified ID.');
    return todo;
  }

  async searchTitleDesc(searchQuery: string) {
    if (!searchQuery)
      throw new UserInputError('Please provide a search query.');
    if (!searchQuery.trim())
      throw new UserInputError('Please provide a non-empty search query.');
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

  async update(id: number, updateTodoInput: UpdateTodoInput) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to update a to-do.');
    if (!updateTodoInput)
      throw new UserInputError(
        'Please provide valid input for updating the to-do.',
      );
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('No to-do found with the specified ID.');
    return this.prisma.todo.update({
      where: { id },
      data: { ...updateTodoInput },
    });
  }

  async remove(id: number) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to remove a to-do.');
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('No to-do found with the specified ID.');
    return this.prisma.todo.delete({ where: { id } });
  }
}
