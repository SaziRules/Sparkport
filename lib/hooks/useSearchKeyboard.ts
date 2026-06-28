'use client';

import { useState, useCallback } from 'react';

interface KeyboardOptions {
  resultCount: number;
  onSelectHighlighted: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function useSearchKeyboard({
  resultCount,
  onSelectHighlighted,
  onSubmit,
  onClose,
}: KeyboardOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const resetHighlight = useCallback(() => setHighlightedIndex(-1), []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, resultCount - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        onSelectHighlighted();
      } else {
        onSubmit();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  return { highlightedIndex, handleKeyDown, resetHighlight };
}
