import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'utilisateur@example.com',
    description: "Adresse email de l'utilisateur",
  })
  @IsEmail({}, { message: 'Veuillez entrer une adresse email valide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({
    example: 'motdepasse123',
    description: "Mot de passe de l'utilisateur",
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({
    example: 'John Doe',
    description: "Nom complet de l'utilisateur",
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;
}
