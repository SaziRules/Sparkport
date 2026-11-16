'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/lib/wordpress';

const STORAGE_KEY = 'sparkport_compare_v1';
const MAX_ITEMS = 4;
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface StoredEntry {
  product: Product;
  addedAt: number;
}

interface CompareContextType {
  items: Product[];
  count: number;
  isFull: boolean;
  isInCompare: (productId: number) => boolean;
  addToCompare: (product: Product) => boolean; // returns false if full
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

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
    // quota exceeded or private-mode blocked — safe to ignore
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  // Hydrate from localStorage AFTER mount so SSR matches first client render.
  useEffect(() => {
    setEntries(readStorage());
  }, []);

  // Persist every change.
  useEffect(() => {
    writeStorage(entries);
  }, [entries]);

  const addToCompare = useCallback((product: Product) => {
    let didAdd = false;
    setEntries((prev) => {
      if (prev.some((e) => e.product.id === product.id)) return prev;
      if (prev.length >= MAX_ITEMS) return prev;
      didAdd = true;
      return [...prev, { product, addedAt: Date.now() }];
    });
    return didAdd;
  }, []);

  const removeFromCompare = useCallback((productId: number) => {
    setEntries((prev) => prev.filter((e) => e.product.id !== productId));
  }, []);

  const clearCompare = useCallback(() => setEntries([]), []);

  const value = useMemo<CompareContextType>(() => ({
    items: entries.map((e) => e.product),
    count: entries.length,
    isFull: entries.length >= MAX_ITEMS,
    isInCompare: (id) => entries.some((e) => e.product.id === id),
    addToCompare,
    removeFromCompare,
    clearCompare,
  }), [entries, addToCompare, removeFromCompare, clearCompare]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
  return ctx;
}

export { MAX_ITEMS as COMPARE_MAX_ITEMS };
