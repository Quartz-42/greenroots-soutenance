import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePurchaseProductDto {
  @IsNotEmpty({ message: "L'identifiant de la commande est requis" })
  @IsNumber({}, { message: "L'identifiant de la commande doit être un nombre" })
  purchase_id: number;

  @IsNotEmpty({ message: "L'identifiant du produit est requis" })
  @IsNumber({}, { message: "L'identifiant du produit doit être un nombre" })
  product_id: number;

  @IsNotEmpty({ message: 'La quantité est requise' })
  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'Le total doit être un nombre' })
  total?: number;
}
