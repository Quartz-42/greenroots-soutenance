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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/guards/role.enum';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('searchQuery') searchQuery?: string,
  ) {
    const pageNumber = Number(page) || 1;
    return this.productsService.findAll(pageNumber, searchQuery);
  }

  @Get('all')
  async findAllWithoutParams(
    ) {
      return this.productsService.findAllWithoutParams();
  }

  @Get('query')
  async findWithQuery(
    @Query('page') page: string,
    @Query('category') category: string | string[],
    @Query('price') price: string | string[], // <-- string[] de "min-max"
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
  } else if (typeof price === "string") {
    const [min, max] = price.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) priceIntervals.push({ min, max });
  }

    return this.productsService.findWithQuery(pageNumber, categoryArray, priceIntervals);
  }

  @Get('best-sellers')
  async getBestSellers() {
    return this.productsService.getBestSellers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.productsService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return this.productsService.update(+id, updateProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.productsService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
