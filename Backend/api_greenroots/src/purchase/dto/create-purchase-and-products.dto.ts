import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { CreatePurchaseDto } from './create-purchase.dto';
import { CreatePurchaseProductDto } from 'src/purchase-product/dto/create-purchase-product.dto';

/**
 * DTO pour recevoir les données de création d'une commande et de ses produits.
 */
export class CreatePurchaseAndProductsDto {
  @ValidateNested()
  @Type(() => CreatePurchaseDto)
  purchase: CreatePurchaseDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseProductDto)
  purchase_products: CreatePurchaseProductDto[];
}
