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
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';

// DTO pour valider le corps de la requête de vérification
class VerifyTokenDto {
  verificationToken: string;
}

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

  @Post(':id/checkout')
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

  // Route pour vérifier le token interne et mettre à jour le statut
  @Post('verify-session')
  async verifySessionAndFinalize(
    // **** DIAGNOSTIC : Utiliser @Body() simple SANS ValidationPipe ****
    @Body() body: any, // Utiliser 'any' pour voir le corps brut
  ) {
    console.log('[verifySession Controller - No Pipe] Received raw body:', body);

    // Extraire manuellement le token (si le corps n'est pas vide)
    const verificationTokenFromBody = body?.verificationToken;
    console.log('[verifySession Controller - No Pipe] verificationToken from body:', verificationTokenFromBody);

    if (!verificationTokenFromBody) {
        throw new HttpException('Le token de vérification est manquant ou invalide dans le corps de la requête.', HttpStatus.BAD_REQUEST);
    }

    try {
      // Utiliser le token extrait manuellement
      const result = await this.purchaseService.verifySessionAndUpdateStatus(
        verificationTokenFromBody,
      );
      console.log('[verifySession Controller - No Pipe] Service returned:', result);
      return result;
    } catch (error) {
      console.error('[verifySession Controller - No Pipe] Error caught:', error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          error.message,
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Erreur lors de la vérification du token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
}
