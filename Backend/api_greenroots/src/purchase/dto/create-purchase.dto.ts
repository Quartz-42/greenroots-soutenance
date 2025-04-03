export class CreatePurchaseDto {
  user_id: number;
  address: string;
  postalcode: string;
  city: string;
  total: number;
  status: string | null;
}
