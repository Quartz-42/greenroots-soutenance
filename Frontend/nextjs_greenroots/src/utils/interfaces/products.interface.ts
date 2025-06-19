import Image from "./images.interface";

export interface Product {
  id: number;
  name: string;
  category: number;
  price: number;
  stock: number;
  short_description: string | null;
  detailed_description: string | null;
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
}
