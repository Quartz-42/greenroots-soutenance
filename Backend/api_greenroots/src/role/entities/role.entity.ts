import { Role } from '@prisma/client';

export class RoleEntity implements Role {
  id: number;
  name: string;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
  }
}
