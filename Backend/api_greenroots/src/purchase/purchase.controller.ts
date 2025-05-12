import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreatePurchaseAndProductsDto) {
    try {
      return this.purchaseService.create(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    try {
      return this.purchaseService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.purchaseService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @UseGuards(AuthGuard)
  @Get(':id/stripe')
  createStripePaymentIntent(@Param('id') id: string) {
    try {
      return this.purchaseService.createStripePaymentIntent(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/checkout')
  createStripeCheckout(@Param('id') id: string) {
    try {
      return this.purchaseService.createStripeCheckout(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    try {
      return this.purchaseService.update(+id, updatePurchaseDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.purchaseService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    try {
      return this.purchaseService.findByUserId(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Post('webhook')
  // handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
  //   try {
  //     return this.purchaseService.handleStripeWebhook(req);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get(':id/payment-status')
  checkPaymentStatus(@Param('id') id: string) {
    try {
      return this.purchaseService.checkPaymentStatus(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
