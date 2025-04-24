export class CreatePurchaseDto {
  user_id: number;
  address: string;
  postalcode: string;
  city: string;
  total: number;
  payment_method: string;
  status: string | null;
  date: Date;
}
