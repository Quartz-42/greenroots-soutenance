import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
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
    try {
      return this.purchaseProductService.create(createPurchaseProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id')
  createMany(@Param('id') purchaseId: string, @Body() products: any) {
    try {
      return this.purchaseProductService.createMany(purchaseId, products);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    try {
      return this.purchaseProductService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
    try {
      return this.purchaseProductService.update(+id, updatePurchaseProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.purchaseProductService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
