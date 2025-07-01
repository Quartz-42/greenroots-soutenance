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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('purchase-products')
@Controller('purchase-products')
export class PurchaseProductController {
  constructor(
    private readonly purchaseProductService: PurchaseProductService,
  ) { }

  @ApiOperation({ summary: 'Créer un lien produit-commande' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiBody({ type: CreatePurchaseProductDto })
  @ApiResponse({
    status: 201,
    description: 'Lien produit-commande créé avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  @Post()
  create(@Body() createPurchaseProductDto: CreatePurchaseProductDto) {
    try {
      return this.purchaseProductService.create(createPurchaseProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Créer plusieurs liens produit-commande pour une commande',
  })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiBody({
    schema: {
      example: { products: [{ product_id: 1, quantity: 2, total: 20 }] },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Liens produits-commandes créés avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la création multiple',
  })
  @Post(':id')
  createMany(@Param('id') purchaseId: string, @Body() products: any) {
    try {
      return this.purchaseProductService.createMany(purchaseId, products);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer tous les liens produits-commandes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des liens produits-commandes récupérée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get()
  findAll() {
    try {
      return this.purchaseProductService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer un lien produit-commande par ID' })
  @ApiParam({ name: 'id', description: 'ID du lien produit-commande' })
  @ApiResponse({
    status: 200,
    description: 'Lien produit-commande récupéré avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseProductService.findOne(+id);
  }

  @ApiOperation({ summary: 'Mettre à jour un lien produit-commande' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: 'ID du lien produit-commande' })
  @ApiBody({ type: UpdatePurchaseProductDto })
  @ApiResponse({
    status: 200,
    description: 'Lien produit-commande mis à jour avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la mise à jour' })
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

  @ApiOperation({ summary: 'Supprimer un lien produit-commande' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: 'ID du lien produit-commande' })
  @ApiResponse({
    status: 200,
    description: 'Lien produit-commande supprimé avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.purchaseProductService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
