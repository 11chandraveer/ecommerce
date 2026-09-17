export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  image: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
};

export type Coupon = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiresAt: string;
  usageLimit: number;
  active: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
};
