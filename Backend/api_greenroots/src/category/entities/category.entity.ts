import { Category } from '@prisma/client';

export class CategoryEntity implements Category {
  id: number;
  name: string;
  description: string | null;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
  }
}
