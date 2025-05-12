import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(3, {
    message: 'Le mot de passe doit contenir au moins 3 caractères',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'Le rôle doit être une chaîne de caractères' })
  role?: string;
}
