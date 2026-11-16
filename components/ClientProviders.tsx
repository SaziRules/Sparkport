'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import CartDrawer from '@/components/CartDrawer';
import ToastContainer from '@/components/ToastContainer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <CompareProvider>
            <WishlistProvider>
              {children}
              <CartDrawer />
              <ToastContainer />
            </WishlistProvider>
          </CompareProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
