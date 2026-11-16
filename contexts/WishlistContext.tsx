'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/lib/wordpress';

const STORAGE_KEY = 'sparkport_wishlist_v1';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface StoredEntry {
  product: Product;
  addedAt: number;
}

interface WishlistContextType {
  items: Product[];
  count: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function pruneExpired(entries: StoredEntry[]): StoredEntry[] {
  const cutoff = Date.now() - TTL_MS;
  return entries.filter((e) => e.addedAt >= cutoff);
}

function readStorage(): StoredEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEntry[];
    if (!Array.isArray(parsed)) return [];
    return pruneExpired(parsed);
  } catch {
    return [];
  }
}

function writeStorage(entries: StoredEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  useEffect(() => {
    setEntries(readStorage());
  }, []);

  useEffect(() => {
    writeStorage(entries);
  }, [entries]);

  const addToWishlist = useCallback((product: Product) => {
    setEntries((prev) => {
      if (prev.some((e) => e.product.id === product.id)) return prev;
      return [{ product, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setEntries((prev) => prev.filter((e) => e.product.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setEntries([]), []);

  const value = useMemo<WishlistContextType>(() => ({
    items: entries.map((e) => e.product),
    count: entries.length,
    isInWishlist: (id) => entries.some((e) => e.product.id === id),
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  }), [entries, addToWishlist, removeFromWishlist, clearWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
