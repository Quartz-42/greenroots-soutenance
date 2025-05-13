import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
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
}

export class RegisterDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'utilisateur@example.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
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

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Jean Dupont',
  })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;
}
