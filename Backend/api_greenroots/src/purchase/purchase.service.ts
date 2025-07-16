import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';
import Stripe from 'stripe';
import * as crypto from 'crypto';

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
      //on  utilise la transaction pour garantir le principe ACID
      // si une erreur survient, on rollback automatiquement
      return await this.prisma.$transaction(async (tx) => {
        const createdPurchase = await tx.purchase.create({
          data: {
            user_id: purchaseData.user_id,
            address: purchaseData.address,
            postalcode: purchaseData.postalcode,
            city: purchaseData.city,
            total: purchaseData.total,
            status: 'En cours', // Statut initial avant paiement
            payment_method: purchaseData.payment_method,
            date: purchaseData.date,
            PurchaseProduct: {
              create: productsData, // Création directe des relations
            },
          },
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
        });

        console.log(
          'Commande créée avec succès :',
          createdPurchase.id,
          'avec',
          createdPurchase.PurchaseProduct.length,
          'produits',
        );
        return createdPurchase;
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error);
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
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Erreur lors de la recherche de la commande ${id}:`, error);
      throw new InternalServerErrorException(
        'Impossible de récupérer la commande.',
      );
    }
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
    await this.findOne(id); // Vérifie si la commande existe

    try {
      // Il est souvent préférable de supprimer d'abord les dépendances
      await this.prisma.purchaseProduct.deleteMany({
        where: { purchase_id: id },
      });
      // Ensuite, supprimer la commande principale
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

  async createStripeCheckout(id: number) {
    try {
      const purchase = await this.findOne(id); // Récupère la commande existante

      // Vérifications essentielles
      if (!purchase) {
        throw new NotFoundException(`Commande avec l'ID ${id} non trouvée.`);
      }
      if (purchase.total === null || typeof purchase.total !== 'number') {
        throw new InternalServerErrorException(
          'Le montant total de la commande est invalide.',
        );
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new InternalServerErrorException(
          "La clé secrète Stripe est manquante dans les variables d'environnement.",
        );
      }
      if (!process.env.FRONTEND_URL) {
        throw new InternalServerErrorException(
          "L'URL du front-end est manquante dans les variables d'environnement.",
        );
      }

      // 1. Générer un token de vérification unique et sécurisé
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

      // 2. Création de la session Checkout Stripe
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Commande GreenRoots #${purchase.id}`,
              },
              unit_amount: Math.round(purchase.total * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?verification_token=${verificationToken}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      });

      if (!session.url) {
        throw new InternalServerErrorException(
          "L'URL de la session Stripe n'a pas pu être générée.",
        );
      }

      // 4. Mettre à jour la commande avec NOTRE token généré dans stripe_id
      try {
        await this.prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            stripe_id: verificationToken, // Stockage de NOTRE token
          },
        });
        console.log(
          `Commande ${purchase.id} mise à jour avec verificationToken (dans stripe_id): ${verificationToken}`,
        );
      } catch (updateError) {
        console.error(
          `Erreur lors de la mise à jour de la commande ${purchase.id} avec verificationToken:`,
          updateError,
        );
        throw new InternalServerErrorException(
          'Impossible de mettre à jour la commande avec le token de vérification.',
        );
      }

      // 5. Retourner l'ID de session Stripe ET l'URL de redirection Stripe au front-end
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      console.error(
        `Erreur lors de la création de la session Stripe pour la commande ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Impossible de créer la session de paiement Stripe.',
      );
    }
  }

  async verifySessionAndUpdateStatus(
    verificationToken: string,
  ): Promise<{ purchaseId: number }> {
    try {
      console.log(
        'Vérification pour verificationToken reçu :',
        verificationToken,
      ); // Log pour debug

      // 1. Trouver la commande par notre token stocké dans stripe_id
      const purchase = await this.prisma.purchase.findFirst({
        where: { stripe_id: verificationToken }, // Recherche avec notre token
      });

      if (!purchase) {
        throw new NotFoundException(
          `Aucune commande trouvée avec le token de vérification: ${verificationToken}`,
        );
      }

      // 2. Vérifier si la commande est dans un état où elle peut être marquée comme payée
      //    (Ex: "En cours". Évite de marquer une commande déjà "Payée" ou "Annulée" à nouveau)
      if (purchase.status !== 'En cours') {
        // Si déjà payée, on peut considérer que c'est un succès mais sans mise à jour
        if (purchase.status === 'Payée') {
          console.log(`Commande ${purchase.id} déjà marquée comme Payée.`);
          return { purchaseId: purchase.id };
        }
        // Pour tout autre statut (Annulée, Échec, etc.), c'est une erreur logique ici
        throw new HttpException(
          `La commande ${purchase.id} n'est pas dans un état valide pour être marquée comme payée (Statut actuel: ${purchase.status})`,
          HttpStatus.CONFLICT, // 409 Conflict est approprié ici
        );
      }

      // 3. Mettre à jour le statut de la commande à "Payée"
      const updatedPurchase = await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: 'Payée' },
      });

      console.log(
        `Statut de la commande ${updatedPurchase.id} mis à jour à "Payée".`,
      );

      // 4. Retourner l'ID de la commande mise à jour
      return { purchaseId: updatedPurchase.id };
    } catch (error) {
      // Log spécifique pour cette fonction
      console.error(
        `Erreur lors de la vérification du token ${verificationToken} et de la mise à jour du statut: `,
        error,
      );

      // Relancer les erreurs connues pour une meilleure gestion dans le contrôleur
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }

      // Erreur générique pour les autres cas
      throw new InternalServerErrorException(
        'Impossible de vérifier le token et de mettre à jour le statut de la commande.',
      );
    }
  }
}
