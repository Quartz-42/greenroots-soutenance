// Mocker RoleService
jest.mock('../role/role.service', () => ({
  RoleService: jest.fn().mockImplementation(() => ({
    findByName: jest.fn().mockResolvedValue({ id: 1, name: 'User' }),
  })),
}), { virtual: true });

// Ajouter des mocks pour les guards
jest.mock(
  'src/guards/auth.guard',
  () => ({
    AuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  }),
  { virtual: true },
);

jest.mock(
  'src/guards/roles.guard',
  () => ({
    RolesGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  }),
  { virtual: true },
);

jest.mock(
  'src/guards/roles.decorator',
  () => ({
    Roles: () => jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  'src/guards/role.enum',
  () => ({
    Role: { Admin: 'admin', User: 'user' },
  }),
  { virtual: true },
);

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
