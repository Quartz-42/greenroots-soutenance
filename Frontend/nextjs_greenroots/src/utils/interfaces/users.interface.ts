import { Roles } from "./roles.interface";

export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  image?: string;
  password: string;
  role: Roles[];
}

export interface UpdateUserDto extends CreateUserDTO {
  name: string;
  email: string;
  image?: string;
  password: string;
  role: Roles[];
}
