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

  it('should query for a single to-do', async () => {
    const todo = await resolver.findOne(1);
    expect(todo).toEqual(mockTodo);
  });

  it('should query all to-dos', () => {
    const todos = resolver.findAll({ take: 1 });
    expect(Array.isArray(todos)).toEqual(true);
  });

  it('should create a new to-do with a title and description', async () => {
    const todo = await resolver.createTodo({ title: 'Mock Todo' });
    expect(todo.title).toBe(mockTodo.title);
    expect(todo.description).toBe(mockTodo.description);
    expect(todo.completed).toBe(false);
  });

  it('should find a to-do given a search query', async () => {
    const todoMatches = await resolver.searchTitleDesc({ searchQuery: 'Call' });
    expect(Array.isArray(todoMatches)).toEqual(true);
    expect(todoMatches).toHaveLength(1);
    expect(todoMatches[0].title).toBe('Mock Todo');
    expect(todoMatches[0].id).toBe(1);
  });
});
