import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(3, {
    message: 'Le mot de passe doit contenir au moins 3 caractères',
  })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(3, {
    message: 'Le mot de passe doit contenir au moins 3 caractères',
  })
  password: string;

  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;
}
