import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchKeyboard } from '@/lib/hooks/useSearchKeyboard';

function makeEvent(key: string): React.KeyboardEvent {
  return { key, preventDefault: vi.fn() } as unknown as React.KeyboardEvent;
}

function makeHook(resultCount = 3) {
  const onSelectHighlighted = vi.fn();
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  const { result } = renderHook(() =>
    useSearchKeyboard({ resultCount, onSelectHighlighted, onSubmit, onClose })
  );
  return { result, onSelectHighlighted, onSubmit, onClose };
}

describe('useSearchKeyboard', () => {
  it('starts at highlightedIndex -1', () => {
    const { result } = makeHook();
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it('ArrowDown increments index, clamped at resultCount-1', () => {
    const { result } = makeHook(3);
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(0);
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(2);
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(2); // clamped
  });

  it('ArrowUp decrements index, clamped at -1', () => {
    const { result } = makeHook(3);
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(1);
    act(() => result.current.handleKeyDown(makeEvent('ArrowUp')));
    expect(result.current.highlightedIndex).toBe(0);
    act(() => result.current.handleKeyDown(makeEvent('ArrowUp')));
    expect(result.current.highlightedIndex).toBe(-1);
    act(() => result.current.handleKeyDown(makeEvent('ArrowUp')));
    expect(result.current.highlightedIndex).toBe(-1); // clamped
  });

  it('Enter with a highlighted item calls onSelectHighlighted, not onSubmit', () => {
    const { result, onSelectHighlighted, onSubmit } = makeHook();
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    act(() => result.current.handleKeyDown(makeEvent('Enter')));
    expect(onSelectHighlighted).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Enter without highlighted item calls onSubmit, not onSelectHighlighted', () => {
    const { result, onSelectHighlighted, onSubmit } = makeHook();
    act(() => result.current.handleKeyDown(makeEvent('Enter')));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSelectHighlighted).not.toHaveBeenCalled();
  });

  it('Escape calls onClose', () => {
    const { result, onClose } = makeHook();
    act(() => result.current.handleKeyDown(makeEvent('Escape')));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('resetHighlight sets index back to -1', () => {
    const { result } = makeHook();
    act(() => result.current.handleKeyDown(makeEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(0);
    act(() => result.current.resetHighlight());
    expect(result.current.highlightedIndex).toBe(-1);
  });
});
