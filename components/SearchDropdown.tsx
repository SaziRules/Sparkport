'use client';

import Image from 'next/image';
import type { SearchResult } from '@/lib/hooks/useSearch';

interface SearchDropdownProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string;
  highlightedIndex: number;
  onResultClick: (id: number) => void;
  onSeeAll: () => void;
  className?: string;
}

export default function SearchDropdown({
  query,
  results,
  isLoading,
  error,
  highlightedIndex,
  onResultClick,
  onSeeAll,
  className = 'absolute top-full left-0 right-0 z-50 mt-1',
}: SearchDropdownProps) {
  return (
    <div className={`${className} bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden`}>
      {isLoading && (
        <ul className="p-2">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-1/4" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && error && (
        <p className="px-4 py-3 text-sm text-neutral-500">{error}</p>
      )}

      {!isLoading && !error && results.length === 0 && (
        <p className="px-4 py-3 text-sm text-neutral-500">
          No products found for <strong>{query}</strong>
        </p>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          <ul className="p-2">
            {results.map((result, i) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => onResultClick(result.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                    highlightedIndex === i ? 'bg-[#e8f5f7]' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="relative w-10 h-10 shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                    {result.image && (
                      <Image
                        src={result.image}
                        alt={result.name}
                        fill
                        sizes="40px"
                        className="object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#184363] truncate">{result.name}</p>
                    <p className="text-sm text-[#009eb9]">{result.price}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-100 px-4 py-3">
            <button
              type="button"
              onClick={onSeeAll}
              className="text-sm text-[#009eb9] font-semibold hover:underline"
            >
              See all results for <strong>{query}</strong> →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
