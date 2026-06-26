'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Cart, CartItem } from '@/lib/wordpress/cart';
import {
  fetchCart,
  addToCart as apiAdd,
  updateCartItem as apiUpdate,
  removeCartItem as apiRemove,
} from '@/lib/wordpress/cart';

interface CartContextType {
  items: CartItem[];
  count: number;
  total: string;
  currencySymbol: string;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: '0',
  currencySymbol: 'R',
  isLoading: false,
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  useEffect(() => {
    fetchCart().then(setCart);
  }, []);

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    setIsLoading(true);
    await apiAdd(productId, quantity);
    const fresh = await fetchCart();
    setCart(fresh);
    setIsDrawerOpen(true);
    setIsLoading(false);
  }, []);

  const updateQuantity = useCallback(async (key: string, quantity: number) => {
    setIsLoading(true);
    await apiUpdate(key, quantity);
    const fresh = await fetchCart();
    setCart(fresh);
    setIsLoading(false);
  }, []);

  const removeFromCart = useCallback(async (key: string) => {
    setIsLoading(true);
    await apiRemove(key);
    const fresh = await fetchCart();
    setCart(fresh);
    setIsLoading(false);
  }, []);

  return (
    <CartContext.Provider value={{
      items: cart?.items ?? [],
      count: cart?.items_count ?? 0,
      total: cart?.totals.total_items ?? '0',
      currencySymbol: cart?.totals.currency_symbol ?? 'R',
      isLoading,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      updateQuantity,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
