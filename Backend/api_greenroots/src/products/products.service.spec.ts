import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const productDto: CreateProductDto = {
        name: 'Test Product',
        category: 1,
        price: 19.99,
        stock: 10,
        short_description: 'Test description',
      };
      const expectedResult = { id: 1, ...productDto };

      mockPrismaService.product.create.mockResolvedValue(expectedResult);

      const result = await service.create(productDto);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: productDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      const mockTotal = 2;
      const page = 1;

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(page);

      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
      expect(mockPrismaService.product.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockProducts,
        meta: {
          currentPage: page,
          pageSize: 9,
          totalItems: mockTotal,
          totalPages: 1,
          hasMore: false,
        },
      });
    });

    it('should handle database errors', async () => {
      mockPrismaService.product.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll(1)).rejects.toThrow(HttpException);
    });
  });

  describe('findAllWithoutParams', () => {
    it('should return all products without pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAllWithoutParams();

      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockProducts,
      });
    });
  });

  describe('findWithQueryFilters', () => {
    it('should filter products by category', async () => {
      const mockProducts = [{ id: 1, category: 1 }];
      const mockTotal = 1;

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(mockTotal);

      const result = await service.findWithQueryFilters(1, [1], []);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { in: [1] },
          }),
        }),
      );
      expect(result.data).toEqual(mockProducts);
    });

    it('should filter products by price range', async () => {
      const mockProducts = [{ id: 1, price: 15 }];
      const mockTotal = 1;

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(mockTotal);

      const result = await service.findWithQueryFilters(
        1,
        [],
        [{ min: 10, max: 20 }],
      );

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ price: { gte: 10, lte: 20 } }],
          }),
        }),
      );
      expect(result.data).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Image: true },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if product not found', async () => {
      mockPrismaService.product.findUnique.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.findOne(999)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = { price: 29.99 };
      const mockProduct = { id: 1, name: 'Product 1', price: 29.99 };

      mockPrismaService.product.update.mockResolvedValue(mockProduct);

      const result = await service.update(1, updateDto);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if update fails', async () => {
      mockPrismaService.product.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.update(1, {})).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };

      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if delete fails', async () => {
      mockPrismaService.product.delete.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(service.remove(1)).rejects.toThrow(Error);
    });
  });

  describe('getBestSellers', () => {
    it('should return random best sellers', async () => {
      const productIds = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
        { id: 4, name: 'Product 4' },
      ];

      mockPrismaService.product.findMany.mockImplementation((params) => {
        if (params?.select?.id) return Promise.resolve(productIds);
        return Promise.resolve(mockProducts);
      });

      const result = await service.getBestSellers();

      expect(mockPrismaService.product.findMany).toHaveBeenCalledTimes(2);
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('should handle empty product list', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);

      const result = await service.getBestSellers();

      expect(result).toEqual([]);
    });

    it('should throw if selected products are not found', async () => {
      mockPrismaService.product.findMany.mockImplementation((params) => {
        if (params?.select?.id) return Promise.resolve([{ id: 1 }]);
        return Promise.resolve([]);
      });

      await expect(service.getBestSellers()).rejects.toThrow(HttpException);
    });
  });
});
