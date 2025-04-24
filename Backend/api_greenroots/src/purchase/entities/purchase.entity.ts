import { Purchase } from '@prisma/client';

export class PurchaseEntity implements Purchase {
  id: number;
  user_id: number;
  address: string;
  postalcode: string;
  city: string;
  total: number;
  date: Date | null;
  payment_method: string | null;
  status: string | null;

  constructor(purchase: Purchase) {
    this.id = purchase.id;
    this.user_id = purchase.user_id;
    this.address = purchase.address;
    this.postalcode = purchase.postalcode;
    this.city = purchase.city;
    this.total = purchase.total;
    this.status = purchase.status;
    this.date = purchase.date;
    this.payment_method = purchase.payment_method;
  }
}
