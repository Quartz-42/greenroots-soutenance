import { Product } from '@prisma/client';

export class ProductEntity {
  id: number;
  name: string;
  category: number;
  price: number;
  stock: number;
  short_description: string | null;
  detailed_description: string | null;
  created_at: Date | null;
  updated_at: Date | null;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.category = product.category;
    this.price = product.price;
    this.stock = product.stock;
    this.short_description = product.short_description;
    this.detailed_description = product.detailed_description;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
  }
}
