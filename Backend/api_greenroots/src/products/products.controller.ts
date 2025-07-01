import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/guards/role.enum';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({ summary: 'Créer un nouveau produit' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      exemple: {
        summary: 'Exemple de création',
        value: {
          name: 'Rosier grimpant',
          category: 2,
          price: 19.99,
          stock: 10,
          short_description: 'Un rosier magnifique',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Produit créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      this.logger.log(
        `Création d'un nouveau produit: ${createProductDto.name}`,
      );
      return this.productsService.create(createProductDto);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la création du produit: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Autocomplete pour barre de recherche' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Terme de recherche (2-50 caractères)',
    type: String,
    example: 'rose',
  })
  @ApiResponse({
    status: 200,
    description: 'Max 10 produits pour autocomplete',
  })
  @ApiResponse({
    status: 400,
    description: 'Recherche invalide',
    type: 'array',
  })
  @Get('findWithSearch')
  async findForSearchBar(@Query('query') searchQuery: string) {
    if (
      !searchQuery ||
      !this.productsService.validateSearchQuery(searchQuery)
    ) {
      return [];
    }
    return this.productsService.findForSearchBar(searchQuery);
  }

  @ApiOperation({ summary: 'Récupérer tous les produits, avec pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits récupérée avec succès',
  })
  @Get()
  async findAll(@Query('page') page: string) {
    const pageNumber = Number(page) || 1;
    return this.productsService.findAll(pageNumber);
  }

  @ApiOperation({ summary: 'Récupérer tous les produits sans pagination' })
  @ApiResponse({
    status: 200,
    description: 'Liste complète des produits récupérée avec succès',
  })
  @Get('all')
  async findAllWithoutParams() {
    return this.productsService.findAllWithoutParams();
  }

  @ApiOperation({ summary: 'Rechercher des produits avec filtres' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: "ID de catégorie ou tableau d'IDs",
    isArray: true,
    type: Number,
  })
  @ApiQuery({
    name: 'price',
    required: false,
    description: 'Intervalle de prix au format "min-max"',
    isArray: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Produits filtrés récupérés avec succès',
  })
  @Get('query')
  async findWithQueryFilters(
    @Query('page') page: string,
    @Query('category') category: string | string[],
    @Query('price') price: string | string[],
  ) {
    const pageNumber = Number(page) || 1;
    const categoryArray: number[] = Array.isArray(category)
      ? category.map((c) => Number(c))
      : category
        ? [Number(category)]
        : [];

    const priceIntervals: { min: number; max: number }[] = [];
    if (Array.isArray(price)) {
      price.forEach((interval) => {
        const [min, max] = interval.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) priceIntervals.push({ min, max });
      });
    } else if (typeof price === 'string') {
      const [min, max] = price.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) priceIntervals.push({ min, max });
    }

    return this.productsService.findWithQueryFilters(
      pageNumber,
      categoryArray,
      priceIntervals,
    );
  }

  @ApiOperation({ summary: 'Récupérer les produits les plus vendus' })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits les plus vendus récupérée avec succès',
  })
  @Get('best-sellers')
  async getBestSellers() {
    return this.productsService.getBestSellers();
  }

  @ApiOperation({ summary: 'Récupérer un produit par ID' })
  @ApiParam({ name: 'id', description: 'ID du produit' })
  @ApiResponse({
    status: 200,
    description: 'Produit récupéré avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Produit non trouvé ou erreur',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Récupération du produit avec l'ID: ${id}`);
      return this.productsService.findOne(+id);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération du produit ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour un produit' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: 'ID du produit' })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      exemple: {
        summary: 'Exemple de mise à jour',
        value: {
          price: 24.99,
          stock: 15,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Produit mis à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      this.logger.log(`Mise à jour du produit avec l'ID: ${id}`);
      return this.productsService.update(+id, updateProductDto);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la mise à jour du produit ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Supprimer un produit' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: 'ID du produit' })
  @ApiResponse({
    status: 200,
    description: 'Produit supprimé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la suppression',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      this.logger.log(`Suppression du produit avec l'ID: ${id}`);
      return this.productsService.remove(+id);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression du produit ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
