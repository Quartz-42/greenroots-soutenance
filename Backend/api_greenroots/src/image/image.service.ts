import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createImageDto: CreateImageDto) {
    try {
      return this.prisma.image.create({
        data: createImageDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    try {
      return this.prisma.image.findMany();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.image.findUnique({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    try {
      return this.prisma.image.update({
        where: { id },
        data: updateImageDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    try {
      return this.prisma.image.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
