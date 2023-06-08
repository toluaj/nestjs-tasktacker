import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './entities/todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

const mockTodo: Todo = {
  id: 1,
  title: 'Mock Todo',
  description: 'Call Tolu',
  completed: false,
};

const todoServiceMock = {
  findOne: jest.fn((id: number): Todo => mockTodo),
  findAll: jest.fn((): Todo[] => [mockTodo]),
  createTodo: jest.fn((title: string, description?: string): Todo => mockTodo),
  searchTitleDesc: jest.fn((searchQuery: string): Todo[] => [mockTodo]),
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
    const todo = await resolver.findOne(1);
    expect(todo).toEqual(mockTodo);
  });

  it('findAll should return an array of to-dos', () => {
    const todos = resolver.findAll();
    expect(Array.isArray(todos)).toBe(true);
    expect(todos).toContainEqual(mockTodo);
  });

  it('createTodo should create a new to-do with title and description', async () => {
    const newTodo = { title: 'Mock Todo', description: 'Call Tolu' };
    const todo = await resolver.createTodo(newTodo);
    expect(todo).toEqual(mockTodo);
  });

  it('searchTitleDesc should find to-dos matching the search query', async () => {
    const searchQuery = 'Call';
    const todoMatches = await resolver.searchTitleDesc({ searchQuery });
    expect(Array.isArray(todoMatches)).toBe(true);
    expect(todoMatches).toHaveLength(1);
    expect(todoMatches[0]).toEqual(mockTodo);
  });
});
