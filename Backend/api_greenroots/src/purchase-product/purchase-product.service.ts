import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePurchaseProductDto } from './dto/create-purchase-product.dto';
import { UpdatePurchaseProductDto } from './dto/update-purchase-product.dto';

@Injectable()
export class PurchaseProductService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPurchaseProductDto: CreatePurchaseProductDto) {
    return this.prisma.purchaseProduct.create({
      data: createPurchaseProductDto,
    });
  }

  findAll() {
    return this.prisma.purchaseProduct.findMany();
  }

  findOne(id: number) {
    return this.prisma.purchaseProduct.findUnique({ where: { id } });
  }

  update(id: number, updatePurchaseProductDto: UpdatePurchaseProductDto) {
    return this.prisma.purchaseProduct.update({
      where: { id },
      data: updatePurchaseProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.purchaseProduct.delete({
      where: { id },
    });
  }
}
