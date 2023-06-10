import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './entities/todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { CreateTodoInput, PaginationArgs, SearchTodoInput } from './dto';
import { BadRequestException } from '@nestjs/common';

const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Mock Todo',
    description: 'Call Tolu',
    completed: false,
  },
];

const context = {
  id: 1,
  username: 'toluajia',
  sub: 1,
  iap: 102940693,
  exp: 14069305,
};

const todoServiceMock = {
  findOne: jest.fn((id: number): Todo | null => {
    const todo = mockTodos.find((t) => t.id === id);
    return todo ?? null;
  }),
  findAll: jest.fn((): Todo[] => mockTodos),
  create: jest.fn((): Todo => mockTodos[0]),
  searchTitleDesc: jest.fn((searchQuery: string): Todo[] => {
    if (searchQuery === 'Non-existent') {
      return [];
    } else {
      return mockTodos.filter(
        (todo) =>
          todo.title.includes(searchQuery) ||
          todo.description.includes(searchQuery),
      );
    }
  }),
};

describe('TodoResolver', () => {
  let resolver: TodoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoResolver,
        { provide: TodoService, useValue: todoServiceMock },
      ],
    }).compile();

    resolver = module.get<TodoResolver>(TodoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('findOne should return a single to-do', async () => {
    const todo = await resolver.findOne(1, context);
    expect(todo).toEqual(mockTodos[0]);
    expect(todoServiceMock.findOne).toHaveBeenCalledWith(1, context);
  });

  it('findOne should return null for non-existent todo', async () => {
    const nonExistentTodoId = 999;
    const todo = await resolver.findOne(nonExistentTodoId, context);

    expect(todo).toBeNull();
    expect(todoServiceMock.findOne).toHaveBeenCalledWith(
      nonExistentTodoId,
      context,
    );
  });

  it('findAll should return an array of to-dos', async () => {
    const paginationArgs: PaginationArgs = { take: 1, skip: 0 };
    const todoFeed = await resolver.findAll(context, paginationArgs);
    const { count, todos } = todoFeed[0];

    expect(Array.isArray(todos)).toBe(true);
    expect(todos).toContainEqual(mockTodos[0]);
    expect(count).toBe(1);
    expect(todoServiceMock.findAll).toHaveBeenCalledWith(
      paginationArgs,
      context,
    );
  });

  it('findAll should throw BadRequestException for invalid pagination arguments', async () => {
    const invalidPaginationArgs: PaginationArgs = { take: -1, skip: -10 };

    await expect(async () => {
      await resolver.findAll(context, invalidPaginationArgs);
    }).rejects.toThrow(BadRequestException);

    expect(todoServiceMock.findAll).not.toHaveBeenCalled();
  });

  it('createTodo should create a new to-do with title and description', async () => {
    const newTodo: CreateTodoInput = {
      title: 'Mock Todo',
      description: 'Call Tolu',
    };
    const todo = await resolver.createTodo(newTodo, context);
    expect(todo).toEqual(mockTodos[0]);
    expect(todoServiceMock.create).toHaveBeenCalledWith(newTodo, context);
  });

  it('searchTitleDesc should find to-dos matching the search query', async () => {
    const searchQuery = 'Call';
    const searchTodoInput: SearchTodoInput = { searchQuery };
    const todoMatches = await resolver.searchTitleDesc(
      searchTodoInput,
      context,
    );
    expect(Array.isArray(todoMatches)).toBe(true);
    expect(todoMatches).toHaveLength(1);
    expect(todoMatches[0]).toEqual(mockTodos[0]);
    expect(todoServiceMock.searchTitleDesc).toHaveBeenCalledWith(
      searchQuery,
      context,
    );
  });

  it('searchTitleDesc should return empty array for non-matching query', async () => {
    const nonMatchingQuery = 'Non-existent';
    const searchTodoInput: SearchTodoInput = { searchQuery: nonMatchingQuery };
    const todoMatches = await resolver.searchTitleDesc(
      searchTodoInput,
      context,
    );
    expect(Array.isArray(todoMatches)).toBe(true);
    expect(todoMatches).toHaveLength(0);
    expect(todoServiceMock.searchTitleDesc).toHaveBeenCalledWith(
      nonMatchingQuery,
      context,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
