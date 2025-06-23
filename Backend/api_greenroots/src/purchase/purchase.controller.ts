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
  NotFoundException,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('purchases')
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiOperation({ summary: 'Créer une commande avec produits' })
  @ApiBody({
    type: CreatePurchaseAndProductsDto,
    examples: {
      exemple: {
        summary: 'Exemple de création',
        value: {
          purchase: {
            user_id: 1,
            address: '12 rue des Fleurs',
            postalcode: '75000',
            city: 'Paris',
            total: 49.99,
            payment_method: 'CB',
          },
          purchase_products: [
            { product_id: 2, quantity: 1, total: 19.99 },
            { product_id: 3, quantity: 2, total: 30.0 },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreatePurchaseAndProductsDto) {
    try {
      return this.purchaseService.create(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer toutes les commandes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des commandes récupérée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    try {
      return this.purchaseService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande récupérée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.purchaseService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Créer une session Stripe Checkout' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiResponse({ status: 201, description: 'Session Stripe créée avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la création de la session Stripe',
  })
  @Post(':id/checkout')
  createStripeCheckout(@Param('id') id: string) {
    try {
      return this.purchaseService.createStripeCheckout(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour une commande' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiBody({
    type: UpdatePurchaseDto,
    examples: {
      exemple: {
        summary: 'Exemple de mise à jour',
        value: {
          address: '15 avenue des Plantes',
          city: 'Lyon',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Commande mise à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la mise à jour' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Supprimer une commande' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande supprimée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.purchaseService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: "Récupérer les commandes d'un utilisateur" })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: "Commandes de l'utilisateur récupérées avec succès",
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    try {
      return this.purchaseService.findByUserId(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Vérifier un token de session et finaliser la commande',
  })
  @ApiBody({
    schema: {
      example: { verificationToken: 'token-ici' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vérification et finalisation réussies',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la vérification' })
  @Post('verify-session')
  async verifySessionAndFinalize(@Body() body: any) {
    console.log(
      '[verifySession Controller - No Pipe] Received raw body:',
      body,
    );

    const verificationTokenFromBody = body?.verificationToken;
    console.log(
      '[verifySession Controller - No Pipe] verificationToken from body:',
      verificationTokenFromBody,
    );

    if (!verificationTokenFromBody) {
      throw new HttpException(
        'Le token de vérification est manquant ou invalide dans le corps de la requête.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.purchaseService.verifySessionAndUpdateStatus(
        verificationTokenFromBody,
      );
      console.log(
        '[verifySession Controller - No Pipe] Service returned:',
        result,
      );
      return result;
    } catch (error) {
      console.error(
        '[verifySession Controller - No Pipe] Error caught:',
        error,
      );
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
}
