import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { RoleService } from 'src/role/role.service';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 1. On va chercher le rôle "User" (défaut)
    const userRole = await this.roleService.findByName('User');

    if (!userRole) {
      throw new Error('Le rôle "User" n’existe pas en base');
    }

    // 2. On crée l'utilisateur, et on associe ce rôle dans UserRole
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        UserRole: {
          create: {
            role_id: userRole.id,
          },
        },
      },
      include: {
        UserRole: {
          include: {
            Role: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    const data = await this.prisma.user.findUnique({
      where: { email },
      include: {
        UserRole: {
          include: {
            Role: true,
          },
        },
      },
    });
    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
