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

  findAll(page: number = 1, searchQuery?: string) {
    const pageSize = 15;
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

    return this.prisma.product.findMany({
      take: pageSize,
      skip: skip,
      where: whereCondition,
      include: {
        Image: true,
        Category: true,
      },
    });
  }

  async findWithQuery(page = 1, category: number[]) {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    return this.prisma.product.findMany({
      take: pageSize,
      skip,
      where: {
        category: {
          in: category,
        },
      },
      include: { Image: true },
    });
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
