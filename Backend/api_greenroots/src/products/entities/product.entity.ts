import { Product } from '@prisma/client';

export class ProductEntity {
  id: number;
  name: string;
  category: number;
  price: number;
  stock: number;
  short_description: string | null;
  detailed_description: string | null;
  height: string | null;
  flower_color: string | null;
  flowering_period: string | null;
  watering_frequency: string | null;
  planting_period: string | null;
  exposure: string | null;
  hardiness: string | null;
  planting_distance: string | null;
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
    this.height = product.height;
    this.flower_color = product.flower_color;
    this.flowering_period = product.flowering_period;
    this.watering_frequency = product.watering_frequency;
    this.planting_period = product.planting_period;
    this.exposure = product.exposure;
    this.hardiness = product.hardiness;
    this.planting_distance = product.planting_distance;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
  }
}
