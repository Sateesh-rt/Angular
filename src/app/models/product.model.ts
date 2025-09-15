export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity?: number;
  // image:string;s
  imageUrl?: string;
  cartItemId?: number;
}
