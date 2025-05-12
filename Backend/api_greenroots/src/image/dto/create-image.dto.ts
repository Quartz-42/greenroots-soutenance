import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsNumber({}, { message: "L'id doit être un nombre" })
  id?: number;

  @IsNotEmpty({ message: "L'URL est requise" })
  @IsUrl({}, { message: "L'URL doit être valide" })
  url: string;

  @IsOptional()
  @IsString({
    message: 'Le texte alternatif doit être une chaîne de caractères',
  })
  alt?: string | null;

  @IsNotEmpty({ message: "L'identifiant du produit est requis" })
  @IsNumber({}, { message: "L'identifiant du produit doit être un nombre" })
  product_id: number;
}
