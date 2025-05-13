import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseProductController } from './purchase-product.controller';
import { PurchaseProductService } from './purchase-product.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  purchaseProduct: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
  },
};

describe('PurchaseProductController', () => {
  let controller: PurchaseProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseProductController],
      providers: [
        PurchaseProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<PurchaseProductController>(PurchaseProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
