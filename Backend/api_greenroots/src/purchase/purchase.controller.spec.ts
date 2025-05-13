// Ajouter des mocks pour les guards et dépendances
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

// Mocker le DTO manquant
jest.mock(
  'src/purchase-product/dto/create-purchase-product.dto',
  () => ({
    CreatePurchaseProductDto: class {
      product_id: number;
      quantity: number;
      total: number;
    },
  }),
  { virtual: true },
);

import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  purchase: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  purchaseProduct: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
};

describe('PurchaseController', () => {
  let controller: PurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        PurchaseService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
