import { Module } from '@nestjs/common';
import { PurchaseProductService } from './purchase-product.service';
import { PurchaseProductController } from './purchase-product.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PurchaseProductController],
  providers: [PurchaseProductService, PrismaService],
})
export class PurchaseProductModule {}
