'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import CartDrawer from '@/components/CartDrawer';
import ToastContainer from '@/components/ToastContainer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <ToastContainer />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
