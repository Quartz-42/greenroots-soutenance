import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePurchaseProductDto } from './dto/create-purchase-product.dto';
import { UpdatePurchaseProductDto } from './dto/update-purchase-product.dto';

@Injectable()
export class PurchaseProductService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPurchaseProductDto: CreatePurchaseProductDto) {
    // Validation que purchase_id est fourni pour la création directe
    if (!createPurchaseProductDto.purchase_id) {
      throw new HttpException(
        'purchase_id is required for direct PurchaseProduct creation',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.purchaseProduct.create({
      data: {
        purchase_id: createPurchaseProductDto.purchase_id,
        product_id: createPurchaseProductDto.product_id,
        quantity: createPurchaseProductDto.quantity,
        total: createPurchaseProductDto.total,
      },
    });
  }

  findAll() {
    try {
      return this.prisma.purchaseProduct.findMany();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.purchaseProduct.findUnique({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updatePurchaseProductDto: UpdatePurchaseProductDto) {
    try {
      return this.prisma.purchaseProduct.update({
        where: { id },
        data: updatePurchaseProductDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    try {
      return this.prisma.purchaseProduct.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  createMany(purchaseId: string, products: any) {
    try {
      const parseId = parseInt(purchaseId);
      const purchaseProducts = products.products.map((product) => ({
        purchase_id: parseId,
        product_id: product.product_id,
        quantity: product.quantity,
        total: product.total,
      }));
      return this.prisma.purchaseProduct.createMany({
        data: purchaseProducts,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
