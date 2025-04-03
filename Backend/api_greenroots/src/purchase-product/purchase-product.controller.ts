import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseProductService } from './purchase-product.service';
import { CreatePurchaseProductDto } from './dto/create-purchase-product.dto';
import { UpdatePurchaseProductDto } from './dto/update-purchase-product.dto';

@Controller('purchase-products')
export class PurchaseProductController {
  constructor(
    private readonly purchaseProductService: PurchaseProductService,
  ) {}

  @Post()
  create(@Body() createPurchaseProductDto: CreatePurchaseProductDto) {
    return this.purchaseProductService.create(createPurchaseProductDto);
  }

  @Post(':id')
  createMany(@Param('id') purchaseId: string, @Body() products: any) {
    return this.purchaseProductService.createMany(purchaseId, products);
  }

  @Get()
  findAll() {
    return this.purchaseProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseProductService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseProductDto: UpdatePurchaseProductDto,
  ) {
    return this.purchaseProductService.update(+id, updatePurchaseProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseProductService.remove(+id);
  }
}
