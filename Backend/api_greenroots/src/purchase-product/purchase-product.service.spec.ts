import { Test, TestingModule } from '@nestjs/testing';
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

describe('PurchaseProductService', () => {
  let service: PurchaseProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PurchaseProductService>(PurchaseProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
