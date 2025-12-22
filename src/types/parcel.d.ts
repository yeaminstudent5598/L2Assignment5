export interface IParcelCreateRequest {
  receiverId: string;
  deliveryAddress: string;
  pickupAddress?: string;
  weight: number;
  price: number;
  couponCode?: string; // এটি যোগ করো
}