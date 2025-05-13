import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Jean Dupont',
  })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'motdepasse123',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(3, {
    message: 'Le mot de passe doit contenir au moins 3 caractères',
  })
  password: string;

  @ApiPropertyOptional({
    description: "Rôle de l'utilisateur",
    example: 'user',
    default: 'user',
  })
  @IsOptional()
  @IsString({ message: 'Le rôle doit être une chaîne de caractères' })
  role?: string;
}
