import { products } from '@/lib/data';

type OrderItem = {
  productId: string;
  quantity: number;
};

export type DemoOrder = {
  id: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed';
  createdAt: string;
};

const orders: DemoOrder[] = [];

export function getProducts() {
  return products;
}

export function createOrder(input: { email: string; items: OrderItem[] }) {
  const total = input.items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const order: DemoOrder = {
    id: `LC-${Date.now().toString(36).toUpperCase()}`,
    email: input.email,
    items: input.items,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  return order;
}

export function getOrders() {
  return orders;
}
