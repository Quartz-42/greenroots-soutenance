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
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
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
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('images')
@Controller('images')
@UseGuards(AuthGuard, RolesGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @ApiOperation({ summary: 'Créer une image' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiBody({
    type: CreateImageDto,
    examples: {
      exemple: {
        summary: 'Exemple de création',
        value: {
          name: 'Test Image',
          alt: 'Description alternative',
          product_id: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    try {
      return this.imageService.create(createImageDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer toutes les images' })
  @ApiResponse({
    status: 200,
    description: 'Liste des images récupérée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get()
  findAll() {
    try {
      return this.imageService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer une image par ID' })
  @ApiParam({ name: 'id', description: "ID de l'image" })
  @ApiResponse({ status: 200, description: 'Image récupérée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.imageService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour une image' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: "ID de l'image" })
  @ApiBody({
    type: UpdateImageDto,
    examples: {
      exemple: {
        summary: 'Exemple de mise à jour',
        value: {
          name: 'Test Image Modifiée',
          alt: 'Nouvelle description',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image mise à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la mise à jour' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    try {
      return this.imageService.update(+id, updateImageDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Supprimer une image' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiParam({ name: 'id', description: "ID de l'image" })
  @ApiResponse({ status: 200, description: 'Image supprimée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - rôle Admin requis',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.imageService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
