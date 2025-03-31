import { Injectable } from '@nestjs/common';
import { CreatePurchaseProductDto } from './dto/create-purchase-product.dto';
import { UpdatePurchaseProductDto } from './dto/update-purchase-product.dto';

@Injectable()
export class PurchaseProductService {
  create(createPurchaseProductDto: CreatePurchaseProductDto) {
    return 'This action adds a new purchaseProduct';
  }

  findAll() {
    return `This action returns all purchaseProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseProduct`;
  }

  update(id: number, updatePurchaseProductDto: UpdatePurchaseProductDto) {
    return `This action updates a #${id} purchaseProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseProduct`;
  }
}
