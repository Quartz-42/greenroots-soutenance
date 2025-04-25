import Image from "./images.interface";

export interface Product {
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
  Image: Image[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductDTO {
  name: string;
  category: number;
  price: number;
  stock: number;
  short_description?: string;
  detailed_description?: string;
  height?: string;
  flower_color?: string;
  flowering_period?: string;
  watering_frequency?: string;
  planting_period?: string;
  exposure?: string;
  hardiness?: string;
  planting_distance?: string;
}
