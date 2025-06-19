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
  Logger,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(RolesGuard)
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Catégorie créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      this.logger.log(
        `Création d'une nouvelle catégorie: ${createCategoryDto.name}`,
      );
      return this.categoryService.create(createCategoryDto);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la création de la catégorie: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories récupérée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la récupération des catégories',
  })
  @Get()
  findAll() {
    try {
      return this.categoryService.findAll();
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération des catégories: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer une catégorie par ID' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie récupérée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Catégorie non trouvée ou erreur',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Récupération de la catégorie avec l'ID: ${id}`);
      return this.categoryService.findOne(+id);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération de la catégorie ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Catégorie mise à jour avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      this.logger.log(`Mise à jour de la catégorie avec l'ID: ${id}`);
      return this.categoryService.update(+id, updateCategoryDto);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la mise à jour de la catégorie ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiResponse({
    status: 200,
    description: 'Catégorie supprimée avec succès',
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
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      this.logger.log(`Suppression de la catégorie avec l'ID: ${id}`);
      return this.categoryService.remove(+id);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression de la catégorie ${id}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
