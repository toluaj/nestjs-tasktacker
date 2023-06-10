import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInput, UpdateTodoInput, PaginationArgs } from './dto';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  create(createTodoInput: CreateTodoInput, context: any) {
    if (!createTodoInput.title)
      throw new BadRequestException('Please provide a title for your to-do!');
    return this.prisma.todo.create({
      data: { ...createTodoInput, user: { connect: { id: context.id } } },
    });
  }

  findAll(paginationArgs: PaginationArgs, context: any) {
    return this.prisma.todo.findMany({
      where: { userId: context.id },
      ...paginationArgs,
    });
  }

  async findOne(id: number, context: any) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to find a to-do.');
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId: context.id },
    });
    if (!todo) {
      throw new NotFoundException('No to-do found with the specified ID.');
    }
    return todo;
  }

  async searchTitleDesc(searchQuery: string, context: any) {
    if (!searchQuery)
      throw new UserInputError('Please provide a search query.');
    if (!searchQuery.trim())
      throw new UserInputError('Please provide a non-empty search query.');

    const todoMatches = await this.prisma.todo.findMany({
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
        userId: context.id,
      },
    });
    return todoMatches;
  }

  async update(id: number, updateTodoInput: UpdateTodoInput, context: any) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to update a to-do.');
    if (!updateTodoInput)
      throw new UserInputError(
        'Please provide valid input for updating the to-do.',
      );
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('No to-do found with the specified ID.');
    if (todo.userId !== context.id)
      throw new Error("You can't edit a to-do that does not belong to you");
    return this.prisma.todo.update({
      where: { id },
      data: { ...updateTodoInput },
    });
  }

  async remove(id: number, context: any) {
    if (!id || id <= 0)
      throw new UserInputError('Please provide a valid ID to remove a to-do.');
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new Error('No to-do found with the specified ID.');
    if (todo.userId !== context.id)
      throw new Error("You can't delete a to-do that does not belong to you");
    return this.prisma.todo.delete({ where: { id } });
  }
}
