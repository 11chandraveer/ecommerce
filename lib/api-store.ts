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
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentProvider?: 'demo' | 'stripe';
  paymentId?: string;
  createdAt: string;
};

// Replace this process-local store with a database (MongoDB/Postgres) before production.
const orders: DemoOrder[] = [];

export function getProducts() {
  return products;
}

export function createOrder(input: {
  email: string;
  items: OrderItem[];
  total?: number;
  status?: DemoOrder['status'];
  paymentProvider?: DemoOrder['paymentProvider'];
  paymentId?: string;
}) {
  const total = input.total ?? input.items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const order: DemoOrder = {
    id: `LC-${Date.now().toString(36).toUpperCase()}`,
    email: input.email,
    items: input.items,
    total,
    status: input.status ?? 'confirmed',
    paymentProvider: input.paymentProvider,
    paymentId: input.paymentId,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  return order;
}

export function findOrderByPaymentId(paymentId: string) {
  return orders.find((order) => order.paymentId === paymentId);
}

export function updateOrderPayment(paymentId: string, status: DemoOrder['status']) {
  const order = findOrderByPaymentId(paymentId);
  if (order) order.status = status;
  return order;
}

export function getOrders() {
  return orders;
}
