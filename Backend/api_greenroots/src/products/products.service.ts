import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll(page: number = 1) {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;
  
    return this.prisma.product.findMany({
      take: pageSize,
      skip: skip,
      include: {
        Image: true,
      },
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
