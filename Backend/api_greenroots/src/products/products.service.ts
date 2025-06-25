import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { searchRequest } from '@prisma/client/sql';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number = 1, searchQuery?: string) {
    try {
      // Si on recoit une recherche
      if (searchQuery) {
        // si on detecte des caractères dangereux ou une longueur non souhaitée on renvoie une 404
        if (!this.validateSearchQuery(searchQuery)) {
          throw new HttpException(`Erreur`, HttpStatus.BAD_REQUEST);
        }

        //sinon  on renvoie vers la methode de recherche
        return this.findForSearchBar(searchQuery);
      }

      const pageSize = 9;
      const skip = (page - 1) * pageSize;

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          take: pageSize,
          skip: skip,
          include: {
            Image: true,
            Category: true,
          },
        }),
        this.prisma.product.count(),
      ]);

      return {
        data: products,
        meta: {
          currentPage: page,
          pageSize,
          totalItems: total,
          totalPages: Math.ceil(total / pageSize),
          hasMore: skip + products.length < total,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllWithoutParams() {
    const products = await this.prisma.product.findMany({
      include: {
        Image: true,
        Category: true,
      },
    });

    return {
      data: products,
    };
  }

  async findWithQueryFilters(
    page = 1,
    category: number[],
    priceIntervals: { min: number; max: number }[],
  ) {
    const pageSize = 9;
    const skip = (page - 1) * pageSize;

    let priceCondition: any = undefined;
    if (priceIntervals.length > 0) {
      priceCondition = {
        OR: priceIntervals.map(({ min, max }) => ({
          price: { gte: min, lte: max },
        })),
      };
    }

    const whereCondition: Prisma.ProductWhereInput = {
      ...(category.length > 0 && {
        category: { in: category },
      }),
      ...(priceCondition && priceCondition),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        take: pageSize,
        skip,
        where: whereCondition,
        include: { Image: true, Category: true },
      }),
      this.prisma.product.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: products,
      meta: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: skip + products.length < total,
      },
    };
  }

  findOne(id: number) {
    try {
      return this.prisma.product.findUnique({
        where: { id },
        include: { Image: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    try {
      return this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getBestSellers(): Promise<Product[]> {
    try {
      const allProductIds = await this.prisma.product.findMany({
        select: {
          id: true,
        },
      });

      if (!allProductIds || allProductIds.length === 0) {
        return [];
      }

      const numberOfProductsToSelect = Math.min(4, allProductIds.length);
      const randomIds = new Set<number>();
      const idsArray = allProductIds.map((p) => p.id);

      while (randomIds.size < numberOfProductsToSelect) {
        const randomIndex = Math.floor(Math.random() * idsArray.length);
        randomIds.add(idsArray[randomIndex]);
      }

      const selectedIds = Array.from(randomIds);

      const bestSellers = await this.prisma.product.findMany({
        where: {
          id: {
            in: selectedIds,
          },
        },
        include: {
          Image: true,
        },
      });

      if (!bestSellers || bestSellers.length === 0) {
        throw new NotFoundException(
          `Could not find products for the selected IDs.`,
        );
      }

      return bestSellers;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findForSearchBar(searchQuery: string) {
    try {
      //utile pour construire le like dans la requete
      const searchPattern = `%${searchQuery}%`;

      //on limite a 10 le nb de resultats affichés dans la barre
      const limit = 10;

      // Utilisation de la fonction TypedSQL générée
      const products = await this.prisma.$queryRawTyped(
        searchRequest(searchPattern, limit),
      );

      // Récupérer les images pour chaque produit
      const productIds = products.map((p: Product) => p.id);
      const images = await this.prisma.image.findMany({
        where: { product_id: { in: productIds } },
      });

      //utilisation de reduce pour regrouper les images par product_id
      // Cela permet de créer un objet où chaque clé est un product_id et la valeur est un tableau d'images associées à ce produit
      const imagesByProductId = images.reduce((acc, img) => {
        if (!acc[img.product_id]) {
          acc[img.product_id] = [];
        }
        acc[img.product_id].push(img);
        return acc;
      }, {});

      // Retraiter les données pour correspondre au format attendu par l'interface Product
      const formattedProducts = products.map((product: Product) => ({
        ...product,
        Image: imagesByProductId[product.id] || [],
        Category: {
          id: product.category,
          name: product.category,
        },
      }));

      return formattedProducts;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  }

  //criteres de longueur de recherche
  private readonly MAX_SEARCH_LENGTH = 50;
  private readonly MIN_SEARCH_LENGTH = 2;

  private validateSearchQuery(query: string): boolean {
    // regex pour filtrer les injections
    const dangerousChars =
      /(?:[';]|--|\/\*|exec|union|select|drop|delete|insert|update)/i;
    return (
      !dangerousChars.test(query) &&
      query.length >= this.MIN_SEARCH_LENGTH &&
      query.length <= this.MAX_SEARCH_LENGTH
    );
  }
}
