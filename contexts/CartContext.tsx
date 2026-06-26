'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Cart, CartItem } from '@/lib/wordpress/cart';
import {
  fetchCart,
  addToCart as apiAdd,
  updateCartItem as apiUpdate,
  removeCartItem as apiRemove,
  CartApiError,
} from '@/lib/wordpress/cart';

export interface ProductSnapshot {
  name: string;
  price: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: string;
  currencySymbol: string;
  isLoading: boolean;
  isDrawerOpen: boolean;
  lastAddedKey: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: number, quantity?: number, productSnapshot?: ProductSnapshot) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
}

const EMPTY_CART: Cart = {
  items: [],
  items_count: 0,
  totals: { total_price: '0', total_items: '0', currency_symbol: 'R' },
};

function optimisticallyAdd(
  cart: Cart,
  productId: number,
  quantity: number,
  snap: ProductSnapshot | undefined,
  tempKey: string
): Cart {
  const existing = cart.items.find(i => i.id === productId);
  let newItems: CartItem[];
  if (existing) {
    newItems = cart.items.map(i =>
      i.id === productId ? { ...i, quantity: i.quantity + quantity } : i
    );
  } else {
    const newItem: CartItem = {
      key: tempKey,
      id: productId,
      quantity,
      name: snap?.name ?? 'Product',
      prices: {
        price: snap?.price ?? '0',
        regular_price: snap?.price ?? '0',
        currency_symbol: 'R',
      },
      totals: {
        line_total: String(parseInt(snap?.price ?? '0', 10) * quantity),
        line_subtotal: String(parseInt(snap?.price ?? '0', 10) * quantity),
        currency_symbol: 'R',
      },
      images: snap?.image ? [{ src: snap.image, alt: snap.name ?? '' }] : [],
    };
    newItems = [...cart.items, newItem];
  }
  const items_count = newItems.reduce((sum, i) => sum + i.quantity, 0);
  const total_items = String(
    newItems.reduce((sum, i) => sum + parseInt(i.prices.price, 10) * i.quantity, 0)
  );
  return {
    ...cart,
    items: newItems,
    items_count,
    totals: { ...cart.totals, total_items },
  };
}

function optimisticallyUpdate(cart: Cart, key: string, quantity: number): Cart {
  let newItems: CartItem[];
  if (quantity <= 0) {
    newItems = cart.items.filter(i => i.key !== key);
  } else {
    newItems = cart.items.map(i => (i.key === key ? { ...i, quantity } : i));
  }
  const items_count = newItems.reduce((sum, i) => sum + i.quantity, 0);
  const total_items = String(
    newItems.reduce((sum, i) => sum + parseInt(i.prices.price, 10) * i.quantity, 0)
  );
  return {
    ...cart,
    items: newItems,
    items_count,
    totals: { ...cart.totals, total_items },
  };
}

function optimisticallyRemove(cart: Cart, key: string): Cart {
  const newItems = cart.items.filter(i => i.key !== key);
  const items_count = newItems.reduce((sum, i) => sum + i.quantity, 0);
  const total_items = String(
    newItems.reduce((sum, i) => sum + parseInt(i.prices.price, 10) * i.quantity, 0)
  );
  return {
    ...cart,
    items: newItems,
    items_count,
    totals: { ...cart.totals, total_items },
  };
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: '0',
  currencySymbol: 'R',
  isLoading: false,
  isDrawerOpen: false,
  lastAddedKey: null,
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
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const nonceRef = useRef<string>('');
  const cartRef = useRef<Cart | null>(null);

  useEffect(() => { cartRef.current = cart; }, [cart]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  useEffect(() => {
    fetchCart().then(data => {
      if (data._nonce) nonceRef.current = data._nonce;
      setCart(data);
    });
  }, []);

  const addToCart = useCallback(async (productId: number, quantity = 1, productSnapshot?: ProductSnapshot) => {
    const tempKey = `optimistic-${Date.now()}`;
    const prevCart = cartRef.current;
    setCart(prev => optimisticallyAdd(prev ?? EMPTY_CART, productId, quantity, productSnapshot, tempKey));
    setLastAddedKey(tempKey);
    setIsDrawerOpen(true);

    try {
      let result = await apiAdd(productId, quantity, nonceRef.current);
      if (result._nonce) nonceRef.current = result._nonce;
      setCart(result);
      setLastAddedKey(result.items.find(i => i.id === productId)?.key ?? null);
    } catch (err) {
      if (err instanceof CartApiError && err.status === 403) {
        const refreshed = await fetchCart();
        if (refreshed._nonce) nonceRef.current = refreshed._nonce;
        setCart(refreshed);
        try {
          const retryResult = await apiAdd(productId, quantity, nonceRef.current);
          if (retryResult._nonce) nonceRef.current = retryResult._nonce;
          setCart(retryResult);
          setLastAddedKey(retryResult.items.find(i => i.id === productId)?.key ?? null);
        } catch {
          setCart(prevCart);
          console.error('addToCart failed after nonce refresh');
        }
      } else {
        setCart(prevCart);
        console.error('addToCart failed', err);
      }
    }

    setTimeout(() => setLastAddedKey(null), 800);
  }, []);

  const updateQuantity = useCallback(async (key: string, quantity: number) => {
    const prevCart = cartRef.current;
    setCart(prev => optimisticallyUpdate(prev ?? EMPTY_CART, key, quantity));

    try {
      const result = await apiUpdate(key, quantity, nonceRef.current);
      if (result._nonce) nonceRef.current = result._nonce;
      setCart(result);
    } catch (err) {
      if (err instanceof CartApiError && err.status === 403) {
        const refreshed = await fetchCart();
        if (refreshed._nonce) nonceRef.current = refreshed._nonce;
        setCart(refreshed);
        try {
          const retryResult = await apiUpdate(key, quantity, nonceRef.current);
          if (retryResult._nonce) nonceRef.current = retryResult._nonce;
          setCart(retryResult);
        } catch {
          setCart(prevCart);
          console.error('updateQuantity failed after nonce refresh');
        }
      } else {
        setCart(prevCart);
        console.error('updateQuantity failed', err);
      }
    }
  }, []);

  const removeFromCart = useCallback(async (key: string) => {
    const prevCart = cartRef.current;
    setCart(prev => optimisticallyRemove(prev ?? EMPTY_CART, key));

    try {
      const result = await apiRemove(key);

      if (result) {
        if (result._nonce) nonceRef.current = result._nonce;
        setCart(result);
      } else {
        const refreshed = await fetchCart();
        if (refreshed._nonce) nonceRef.current = refreshed._nonce;
        if (!refreshed.items.some(i => i.key === key)) {
          setCart(refreshed);
        } else {
          setCart(prevCart);
          console.error('removeFromCart failed');
        }
      }
    } catch (err) {
      setCart(prevCart);
      console.error('removeFromCart failed', err);
    }
  }, []);

  const value = useMemo(() => ({
    items: cart?.items ?? [],
    count: cart?.items_count ?? 0,
    total: cart?.totals.total_items ?? '0',
    currencySymbol: cart?.totals.currency_symbol ?? 'R',
    isLoading,
    isDrawerOpen,
    lastAddedKey,
    openDrawer,
    closeDrawer,
    addToCart,
    updateQuantity,
    removeFromCart,
  }), [cart, isLoading, isDrawerOpen, lastAddedKey, openDrawer, closeDrawer, addToCart, updateQuantity, removeFromCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
