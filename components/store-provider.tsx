'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product, User } from '@/lib/types';
import { coupons, products } from '@/lib/data';

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  setUser: (user: User | null) => void;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('luxecart-cart');
    const storedWishlist = localStorage.getItem('luxecart-wishlist');
    const storedUser = localStorage.getItem('luxecart-user');
    const storedCoupon = localStorage.getItem('luxecart-coupon');

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCoupon) setCouponCode(storedCoupon);
  }, []);

  useEffect(() => {
    localStorage.setItem('luxecart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxecart-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('luxecart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxecart-user');
    }
  }, [user]);

  useEffect(() => {
    if (couponCode) localStorage.setItem('luxecart-coupon', couponCode);
    else localStorage.removeItem('luxecart-coupon');
  }, [couponCode]);

  const addToCart = (productId: string, quantity = 1) => {
    setCart((current) => {
      const product = products.find((entry) => entry.id === productId);
      if (!product || product.stock < 1) return current;
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item);
      }
      return [...current, { productId, quantity: Math.min(product.stock, Math.max(1, quantity)) }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((current) => current.map((item) => {
      if (item.productId !== productId) return item;
      const product = products.find((entry) => entry.id === productId);
      return { ...item, quantity: Math.min(product?.stock ?? 0, Math.max(0, quantity)) };
    }).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => setCart((current) => current.filter((item) => item.productId !== productId));

  const clearCart = () => setCart([]);

  const applyCoupon = (code: string) => {
    const coupon = coupons.find((entry) => entry.code.toLowerCase() === code.trim().toLowerCase() && entry.active);
    if (!coupon || cartTotal < coupon.minOrder) return false;
    setCouponCode(coupon.code);
    return true;
  };

  const removeCoupon = () => setCouponCode('');

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => current.includes(productId) ? current.filter((item) => item !== productId) : [...current, productId]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const cartTotal = useMemo(() => cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId) as Product | undefined;
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0), [cart]);

  const discountAmount = useMemo(() => {
    const coupon = coupons.find((entry) => entry.code === couponCode);
    if (!coupon || cartTotal < coupon.minOrder) return 0;
    return coupon.type === 'percentage' ? Math.round(cartTotal * coupon.value / 100) : Math.min(coupon.value, cartTotal);
  }, [cartTotal, couponCode]);

  return (
    <StoreContext.Provider value={{ cart, wishlist, user, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, setUser, cartCount, wishlistCount, cartTotal, couponCode, discountAmount, applyCoupon, removeCoupon, clearCart }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
