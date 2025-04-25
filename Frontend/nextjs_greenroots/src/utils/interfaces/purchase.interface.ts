import { Product } from './products.interface';

export interface PurchaseProductItem {
  id: number;
  quantity: number;
  total?: number;
  product_id: number;
  Product: Product;
}

export interface PurchaseDetails {
    id: number;
    user_id: number;
    date: string;
    payment_method: string;
    address: string;
    postalcode: string;
    city: string;
    status?: string;       
    total?: number;      
    PurchaseProduct: PurchaseProductItem[];
}