import { IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsNumber({}, { message: "L'id doit être un nombre" })
  id?: number;

  @IsNotEmpty({ message: 'Le nom du rôle est requis' })
  @IsString({ message: 'Le nom du rôle doit être une chaîne de caractères' })
  name: string;
}
