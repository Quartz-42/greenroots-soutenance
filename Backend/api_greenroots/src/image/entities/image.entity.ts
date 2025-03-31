import { Image } from '@prisma/client';

export class ImageEntity implements Image {
  id: number;
  url: string;
  alt: string | null;
  product_id: number;

  constructor(product: Image) {
    this.id = product.id;
    this.url = product.url;
    this.alt = product.alt;
    this.product_id = product.product_id;
  }
}
