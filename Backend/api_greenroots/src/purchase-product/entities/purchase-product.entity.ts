import { PurchaseProduct } from '@prisma/client';

export class PurchaseProductEntity {
  id: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  total?: number | null;

  constructor(purchaseProduct: PurchaseProduct) {
    this.id = purchaseProduct.id;
    this.purchase_id = purchaseProduct.purchase_id;
    this.product_id = purchaseProduct.product_id;
    this.quantity = purchaseProduct.quantity;
    this.total = purchaseProduct.total;
  }
}
