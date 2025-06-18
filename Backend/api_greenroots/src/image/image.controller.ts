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
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Créer une image' })
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    try {
      return this.imageService.update(+id, updateImageDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Supprimer une image' })
  @ApiParam({ name: 'id', description: "ID de l'image" })
  @ApiResponse({ status: 200, description: 'Image supprimée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.imageService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
