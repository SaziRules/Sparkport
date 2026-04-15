'use client';

import { createContext, useContext, useState } from 'react';

interface CartContextType {
  count: number;
  setCount: (n: number) => void;
}

const CartContext = createContext<CartContextType>({ count: 0, setCount: () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  // TODO: initialise from WooCommerce cart API / localStorage
  const [count, setCount] = useState(0);

  return (
    <CartContext.Provider value={{ count, setCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
