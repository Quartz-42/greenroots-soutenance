export class CreatePurchaseDto {
  id: number;
  user_id: number;
  address: string;
  postalcode: string;
  city: string;
  total: number;
  status: string | null;
}
