import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  @IsNumber({}, { message: "L'id doit être un nombre" })
  id?: number;

  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description?: string | null;

  @IsOptional()
  @IsString({ message: "L'image doit être une chaîne de caractères" })
  image?: string | null;
}
