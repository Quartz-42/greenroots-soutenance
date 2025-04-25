
export interface PurchaseDetails {
    id: number;
    user_id: number;
    date: string;
    payment_method: string;
    address: string;
    postalcode: string;
    city: string;
    PurchaseProduct: any[];
  }