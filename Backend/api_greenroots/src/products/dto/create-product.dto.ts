export class CreateProductDto {
  name: string;
  category: number;
  price: number;
  stock: number;
  short_description?: string | null;
  detailed_description?: string | null;
  height?: string | null;
  flower_color?: string | null;
  flowering_period?: string | null;
  watering_frequency?: string | null;
  planting_period?: string | null;
  exposure?: string | null;
  hardiness?: string | null;
  planting_distance?: string | null;
}
