export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  orders?: Order[];
}

export interface Order {
  id: string;
  clientId: string;
  status: string;
  total: number;
  createdAt: string;
  client?: Client;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}
