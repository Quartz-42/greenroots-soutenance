import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @IsNotEmpty({ message: 'La catégorie est requise' })
  @IsNumber({}, { message: 'La catégorie doit être un identifiant numérique' })
  category: number;

  @IsNotEmpty({ message: 'Le prix est requis' })
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  price: number;

  @IsNotEmpty({ message: 'Le stock est requis' })
  @IsNumber({}, { message: 'Le stock doit être un nombre' })
  stock: number;

  @IsOptional()
  @IsString({
    message: 'La description courte doit être une chaîne de caractères',
  })
  short_description?: string | null;

  @IsOptional()
  @IsString({
    message: 'La description détaillée doit être une chaîne de caractères',
  })
  detailed_description?: string | null;
}
