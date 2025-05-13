import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    description: 'ID de la catégorie (optionnel lors de la création)',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: "L'id doit être un nombre" })
  id?: number;

  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Légumes',
    type: String,
  })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @ApiPropertyOptional({
    description: 'Description de la catégorie',
    example: 'Les légumes frais de saison',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description?: string | null;

  @ApiPropertyOptional({
    description: "URL de l'image de la catégorie",
    example: 'https://example.com/legumes.jpg',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString({ message: "L'image doit être une chaîne de caractères" })
  image?: string | null;
}
