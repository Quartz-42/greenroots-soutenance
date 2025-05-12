import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePurchaseAndProductsDto } from './dto/create-purchase-and-products.dto';
import Stripe from 'stripe';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePurchaseAndProductsDto) {
    try {
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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

  async createStripePaymentIntent(id: number) {
    try {
      const purchase = await this.findOne(id);
      if (!purchase) {
        throw new NotFoundException(`Commande avec l'ID ${id} non trouvée.`);
      }
      if (purchase.total === null) {
        throw new InternalServerErrorException(
          'Le montant total de la commande ne peut pas être null.',
        );
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new InternalServerErrorException(
          "La clé secrète Stripe est manquante dans les variables d'environnement.",
        );
      }
      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: purchase.total * 100,
        currency: 'eur',
        automatic_payment_methods: {
          enabled: true,
        },
      });
      const updatePurchase = await this.update(id, {
        stripe_id: paymentIntent.id,
      });
      if (!updatePurchase) {
        throw new InternalServerErrorException(
          "Impossible de mettre à jour la commande avec l'ID Stripe.",
        );
      }

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('Erreur lors de la création du paiement Stripe:', error);
      throw new InternalServerErrorException(
        'Impossible de créer le paiement Stripe.',
      );
    }
  }

  // async handleStripeWebhook(req: RawBodyRequest<Request>) {
  //   try {
  //     if (!process.env.STRIPE_SECRET_KEY) {
  //       throw new InternalServerErrorException(
  //         "La clé secrète Stripe est manquante dans les variables d'environnement.",
  //       );
  //     }

  //     // Récupération directe de l'événement du corps de la requête
  //     const event = req.body;

  //     if (!event || !event.type || !event.data) {
  //       throw new HttpException(
  //         'Corps de requête invalide',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     // Traiter les événements Stripe
  //     switch (event.type) {
  //       case 'payment_intent.succeeded': {
  //         const paymentIntent = event.data.object as Stripe.PaymentIntent;
  //         await this.handlePaymentSuccess(paymentIntent);
  //         break;
  //       }
  //       case 'payment_intent.payment_failed': {
  //         const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
  //         await this.handlePaymentFailure(failedPaymentIntent);
  //         break;
  //       }
  //     }

  //     return { received: true };
  //   } catch (error) {
  //     console.error('Erreur lors du traitement du webhook Stripe:', error);
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async createStripeCheckout(id: number) {
    try {
      const purchase = await this.findOne(id);
      if (!purchase) {
        throw new NotFoundException(`Commande avec l'ID ${id} non trouvée.`);
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new InternalServerErrorException(
          "La clé secrète Stripe est manquante dans les variables d'environnement.",
        );
      }
      if (purchase.total === null) {
        throw new InternalServerErrorException(
          'Le montant total de la commande ne peut pas être null.',
        );
      }
      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Commande #' + purchase.id,
              },
              unit_amount: purchase.total * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/recapitulatif?id=${purchase.id}`,
        cancel_url: `${process.env.FRONTEND_URL}/`,
      });

      // Stocker directement l'ID de session pour le moment
      const response = await this.update(id, {
        stripe_id: session.id,
      });

      if (!response) {
        throw new InternalServerErrorException(
          "Impossible de mettre à jour la commande avec l'ID Stripe.",
        );
      }

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      throw new InternalServerErrorException(
        'Impossible de créer la session de paiement Stripe.',
      );
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    try {
      // Trouver la commande par Stripe ID
      const purchase = await this.prisma.purchase.findFirst({
        where: { stripe_id: paymentIntent.id },
      });

      if (!purchase) {
        console.error(
          `Aucune commande trouvée avec le Stripe ID: ${paymentIntent.id}`,
        );
        return;
      }

      // Mettre à jour le statut
      await this.update(purchase.id, {
        status: 'Payée',
      });
    } catch (error) {
      console.error('Erreur lors du traitement du paiement réussi:', error);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    try {
      const purchase = await this.prisma.purchase.findFirst({
        where: { stripe_id: paymentIntent.id },
      });

      if (!purchase) {
        console.error(
          `Aucune commande trouvée avec le Stripe ID: ${paymentIntent.id}`,
        );
        return;
      }

      await this.update(purchase.id, {
        status: 'Échec de paiement',
      });
    } catch (error) {
      console.error("Erreur lors du traitement de l'échec de paiement:", error);
    }
  }

  async checkPaymentStatus(id: number) {
    try {
      const purchase = await this.findOne(id);

      if (!purchase.stripe_id) {
        return { status: 'no_payment', purchase };
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        throw new InternalServerErrorException(
          "La clé secrète Stripe est manquante dans les variables d'environnement.",
        );
      }

      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripeClient.paymentIntents.retrieve(
        purchase.stripe_id,
      );

      return {
        status: paymentIntent.status,
        purchase,
        payment_details: paymentIntent,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la vérification du statut de paiement:',
        error,
      );
      throw new InternalServerErrorException(
        'Impossible de vérifier le statut du paiement.',
      );
    }
  }
}
