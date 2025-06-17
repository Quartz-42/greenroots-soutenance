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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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

@ApiTags('roles')
@Controller('roles')
@UseGuards(RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Créer un rôle' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Rôle créé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.roleService.create(createRoleDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer tous les rôles' })
  @ApiResponse({
    status: 200,
    description: 'Liste des rôles récupérée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get()
  findAll() {
    try {
      return this.roleService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Récupérer un rôle par ID' })
  @ApiParam({ name: 'id', description: 'ID du rôle' })
  @ApiResponse({ status: 200, description: 'Rôle récupéré avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la récupération' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.roleService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour un rôle' })
  @ApiParam({ name: 'id', description: 'ID du rôle' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Rôle mis à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la mise à jour' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleService.update(+id, updateRoleDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Supprimer un rôle' })
  @ApiParam({ name: 'id', description: 'ID du rôle' })
  @ApiResponse({ status: 200, description: 'Rôle supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.roleService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
