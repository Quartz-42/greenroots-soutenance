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

// Nouvelles interfaces pour la création de commande
export interface CreatePurchaseProduct {
  product_id: number;
  quantity: number;
}

export interface CreatePurchase {
  user_id?: number;
  address: string;
  postalcode: string;
  city: string;
  total: number;
  status: string;
  date: Date;
  payment_method: string;
}

export interface PurchaseData {
  purchase: CreatePurchase;
  purchase_products: CreatePurchaseProduct[];
}