import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number = 1, searchQuery?: string) {
    const pageSize = 9;
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ProductWhereInput = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            {
              Category: {
                name: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            { flower_color: { contains: searchQuery, mode: 'insensitive' } },
            {
              flowering_period: { contains: searchQuery, mode: 'insensitive' },
            },
            { planting_period: { contains: searchQuery, mode: 'insensitive' } },
            { exposure: { contains: searchQuery, mode: 'insensitive' } },
            { hardiness: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        take: pageSize,
        skip: skip,
        where: whereCondition,
        include: {
          Image: true,
          Category: true,
        },
      }),
      this.prisma.product.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: products,
      meta: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: skip + products.length < total,
      },
    };
  }

  async findWithQuery(page = 1, category: number[]) {
    const pageSize = 9;
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ProductWhereInput = {
      category: {
        in: category.length > 0 ? category : undefined,
      },
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        take: pageSize,
        skip,
        where: whereCondition,
        include: { Image: true, Category: true },
      }),
      this.prisma.product.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: products,
      meta: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: skip + products.length < total,
      },
    };
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { Image: true },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
