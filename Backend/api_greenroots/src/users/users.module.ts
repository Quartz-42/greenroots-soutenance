import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [UsersController],
  providers: [PrismaService, UserService, RoleService],
  exports: [UserService],
})
export class UsersModule {}
