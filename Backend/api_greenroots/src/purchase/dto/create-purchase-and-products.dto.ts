import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { CreatePurchaseDto } from './create-purchase.dto';
import { CreatePurchaseProductDto } from 'src/purchase-product/dto/create-purchase-product.dto';

/**
 * DTO pour recevoir les données de création d'une commande et de ses produits.
 */
export class CreatePurchaseAndProductsDto {
  @ValidateNested({ message: 'Les informations de la commande sont invalides' })
  @Type(() => CreatePurchaseDto)
  purchase: CreatePurchaseDto;

  @IsArray({ message: 'Les produits doivent être un tableau' })
  @ArrayMinSize(1, {
    message: 'Au moins un produit doit être ajouté à la commande',
  })
  @ValidateNested({
    each: true,
    message: 'Un ou plusieurs produits sont invalides',
  })
  @Type(() => CreatePurchaseProductDto)
  purchase_products: CreatePurchaseProductDto[];
}
