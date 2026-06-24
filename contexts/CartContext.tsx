'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nonceRef = useRef('');

  useEffect(() => {
    fetchCart().then(({ cart, nonce }) => {
      setCart(cart);
      nonceRef.current = nonce;
    });
  }, []);

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    setIsLoading(true);
    const updated = await apiAdd(productId, quantity, nonceRef.current);
    if (updated) setCart(updated);
    setIsLoading(false);
  }, []);

  const updateQuantity = useCallback(async (key: string, quantity: number) => {
    setIsLoading(true);
    const updated = await apiUpdate(key, quantity, nonceRef.current);
    if (updated) setCart(updated);
    setIsLoading(false);
  }, []);

  const removeFromCart = useCallback(async (key: string) => {
    setIsLoading(true);
    const updated = await apiRemove(key, nonceRef.current);
    if (updated) setCart(updated);
    setIsLoading(false);
  }, []);

  return (
    <CartContext.Provider value={{
      items: cart?.items ?? [],
      count: cart?.items_count ?? 0,
      total: cart?.totals.total_price ?? '0',
      currencySymbol: cart?.totals.currency_symbol ?? 'R',
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
