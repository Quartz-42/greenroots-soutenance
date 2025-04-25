import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePurchaseAndProductsDto) {
    const { purchase: purchaseData, purchase_products: productsData } = data;
    if (typeof purchaseData.total !== 'number') {
      throw new InternalServerErrorException(
        'Purchase total must be a number.',
      );
    }
    if (!purchaseData.user_id) {
      throw new InternalServerErrorException(
        'User ID is required to create a purchase.',
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const createdPurchase = await tx.purchase.create({
          data: {
            user_id: purchaseData.user_id,
            address: purchaseData.address,
            postalcode: purchaseData.postalcode,
            city: purchaseData.city,
            total: purchaseData.total,
            status: purchaseData.status ?? 'En cours',
          },
        });

        const purchaseProductsToCreate = productsData.map((product) => {
          if (!product.product_id || !product.quantity) {
            throw new InternalServerErrorException(
              'Product ID and quantity are required for all purchase products.',
            );
          }

          return {
            purchase_id: createdPurchase.id,
            product_id: product.product_id,
            quantity: product.quantity,
          };
        });

        await tx.purchaseProduct.createMany({
          data: purchaseProductsToCreate,
        });

        console.log('Commande et produits enregistrés:', createdPurchase.id);
        return createdPurchase;
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw new InternalServerErrorException(
        'Impossible de créer la commande.',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.purchase.findMany();
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw new InternalServerErrorException(
        'Impossible de récupérer les commandes.',
      );
    }
  }

  async findOne(id: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        PurchaseProduct: true,
      },
    });
    if (!purchase) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée.`);
    }
    return purchase;
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const { ...dataToUpdate } = updatePurchaseDto;

    await this.findOne(id);

    try {
      return await this.prisma.purchase.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la commande ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Impossible de mettre à jour la commande.',
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.purchase.delete({
        where: { id },
      });
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la commande ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Impossible de supprimer la commande.',
      );
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.purchase.findMany({
        where: { user_id: userId },
        include: {
          PurchaseProduct: {
            include: {
              Product: {
                include: {
                  Image: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw new InternalServerErrorException(
        'Impossible de récupérer les commandes.',
      );
    }
  }
}
