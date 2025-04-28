export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
}
