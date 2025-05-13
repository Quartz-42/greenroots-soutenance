import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException } from '@nestjs/common';

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

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithoutParams: jest.fn(),
    findWithQuery: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getBestSellers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        category: 1,
        price: 19.99,
        stock: 10,
        short_description: 'Description test',
      };
      const expectedResult = { id: 1, ...createDto };

      mockProductsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an exception when creation fails', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        category: 1,
        price: 19.99,
        stock: 10,
        short_description: 'Description test',
      };

      mockProductsService.create.mockRejectedValue(
        new HttpException('Creation failed', 400),
      );

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = {
        data: [{ id: 1, name: 'Product 1' }],
        meta: {
          currentPage: 1,
          pageSize: 9,
          totalItems: 1,
          totalPages: 1,
          hasMore: false,
        },
      };

      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll('1');

      expect(mockProductsService.findAll).toHaveBeenCalledWith(1, undefined);
      expect(result).toEqual(mockProducts);
    });

    it('should handle search query', async () => {
      const searchQuery = 'rose';
      mockProductsService.findAll.mockResolvedValue({
        data: [{ id: 1, name: 'Rose' }],
        meta: { currentPage: 1 },
      });

      await controller.findAll('1', searchQuery);

      expect(mockProductsService.findAll).toHaveBeenCalledWith(1, searchQuery);
    });
  });

  describe('findAllWithoutParams', () => {
    it('should return all products without pagination', async () => {
      const mockProducts = { data: [{ id: 1 }, { id: 2 }] };

      mockProductsService.findAllWithoutParams.mockResolvedValue(mockProducts);

      const result = await controller.findAllWithoutParams();

      expect(mockProductsService.findAllWithoutParams).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findWithQuery', () => {
    it('should filter products with category', async () => {
      const mockProducts = {
        data: [{ id: 1, category: 1 }],
        meta: { currentPage: 1 },
      };

      mockProductsService.findWithQuery.mockResolvedValue(mockProducts);

      const result = await controller.findWithQuery('1', '1', '');

      expect(mockProductsService.findWithQuery).toHaveBeenCalledWith(
        1,
        [1],
        [],
      );
      expect(result).toEqual(mockProducts);
    });

    it('should filter products with price range', async () => {
      const mockProducts = {
        data: [{ id: 1, price: 15 }],
        meta: { currentPage: 1 },
      };

      mockProductsService.findWithQuery.mockResolvedValue(mockProducts);

      const result = await controller.findWithQuery('1', '', '10-20');

      expect(mockProductsService.findWithQuery).toHaveBeenCalledWith(
        1,
        [],
        [{ min: 10, max: 20 }],
      );
      expect(result).toEqual(mockProducts);
    });

    it('should filter products with category and price range', async () => {
      const mockProducts = {
        data: [{ id: 1, category: 1, price: 15 }],
        meta: { currentPage: 1 },
      };

      mockProductsService.findWithQuery.mockResolvedValue(mockProducts);

      const result = await controller.findWithQuery('1', '1', '10-20');

      expect(mockProductsService.findWithQuery).toHaveBeenCalledWith(
        1,
        [1],
        [{ min: 10, max: 20 }],
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };

      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if product not found', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new HttpException('Not found', 404),
      );

      await expect(controller.findOne('999')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = { price: 29.99 };
      const mockProduct = { id: 1, price: 29.99 };

      mockProductsService.update.mockResolvedValue(mockProduct);

      const result = await controller.update('1', updateDto);

      expect(mockProductsService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if update fails', async () => {
      mockProductsService.update.mockRejectedValue(
        new HttpException('Update failed', 400),
      );

      await expect(controller.update('1', {})).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProduct = { id: 1 };

      mockProductsService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove('1');

      expect(mockProductsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw an exception if deletion fails', async () => {
      mockProductsService.remove.mockRejectedValue(
        new HttpException('Delete failed', 400),
      );

      await expect(controller.remove('1')).rejects.toThrow(HttpException);
    });
  });

  describe('getBestSellers', () => {
    it('should return best seller products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      mockProductsService.getBestSellers.mockResolvedValue(mockProducts);

      const result = await controller.getBestSellers();

      expect(mockProductsService.getBestSellers).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });
});
