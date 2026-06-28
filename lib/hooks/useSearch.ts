'use client';

import { useState, useEffect, useRef } from 'react';

export interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
}

export function useSearch(query: string): {
  results: SearchResult[];
  isLoading: boolean;
  error: string;
} {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setError('');
      return;
    }

    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError('');

      fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=6`, {
        signal: controller.signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error('fetch failed');
          return r.json() as Promise<{ results: SearchResult[] }>;
        })
        .then((data) => {
          setResults(data.results);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          if ((err as Error).name === 'AbortError') return;
          setResults([]);
          setError("Couldn't load results. Please try again.");
          setIsLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  return { results, isLoading, error };
}
