export class CreateUserDto {
  id: number;
  name: string;
  email: string;
  image: string;
  password: string;
  created_at: Date | null;
  updated_at: Date | null;
}
