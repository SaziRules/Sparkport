import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { Cart } from '@/lib/wordpress/cart';

// --- hoisted mocks ---
const { mockShowToast } = vi.hoisted(() => ({
  mockShowToast: vi.fn(),
}));

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast, toasts: [], dismissToast: vi.fn() }),
}));

vi.mock('@/lib/wordpress/cart', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wordpress/cart')>();
  return {
    ...actual,
    fetchCart: vi.fn(),
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
  };
});

// --- imports after mocks ---
import { CartProvider, useCart } from '@/contexts/CartContext';
import * as cartLib from '@/lib/wordpress/cart';

const EMPTY_CART: Cart = {
  items: [],
  items_count: 0,
  totals: { total_price: '0', total_items: '0', total_discount: '0', total_shipping: '0', currency_symbol: 'R' },
};

const CART_WITH_ITEM: Cart = {
  items: [
    {
      key: 'real-key-1',
      id: 42,
      quantity: 1,
      name: 'Test Product',
      prices: { price: '1000', regular_price: '1000', currency_symbol: 'R' },
      totals: { line_total: '1000', line_subtotal: '1000', currency_symbol: 'R' },
      images: [],
    },
  ],
  items_count: 1,
  totals: { total_price: '1000', total_items: '1000', total_discount: '0', total_shipping: '0', currency_symbol: 'R' },
  _nonce: 'fresh-nonce',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(cartLib.fetchCart).mockResolvedValue(EMPTY_CART);
});

// --- B6: isLoading on initial fetch ---
describe('B6 — isLoading on initial fetch', () => {
  it('is true while fetchCart is pending', async () => {
    let resolve!: (c: Cart) => void;
    vi.mocked(cartLib.fetchCart).mockImplementation(
      () => new Promise((r) => { resolve = r; })
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await act(async () => { resolve(EMPTY_CART); });

    expect(result.current.isLoading).toBe(false);
  });
});

// --- C2: showToast on mutation failures ---
describe('C2 — showToast called on all mutation failures', () => {
  it('calls showToast with error when addToCart fails', async () => {
    vi.mocked(cartLib.fetchCart).mockResolvedValue(EMPTY_CART);
    vi.mocked(cartLib.addToCart).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {}); // flush initial fetch

    await act(async () => {
      try { await result.current.addToCart(42, 1); } catch { /* expected */ }
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Couldn't add"),
      'error'
    );
  });

  it('calls showToast with error when updateQuantity fails', async () => {
    vi.mocked(cartLib.fetchCart).mockResolvedValue(CART_WITH_ITEM);
    vi.mocked(cartLib.updateCartItem).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.updateQuantity('real-key-1', 2);
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Couldn't update"),
      'error'
    );
  });

  it('calls showToast with error when removeFromCart fails', async () => {
    vi.mocked(cartLib.fetchCart).mockResolvedValue(CART_WITH_ITEM);
    vi.mocked(cartLib.removeCartItem).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.removeFromCart('real-key-1');
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Couldn't remove"),
      'error'
    );
  });
});

// --- C1: addToCart re-throws so callers can detect failure ---
describe('C1 — addToCart re-throws on terminal failure', () => {
  it('throws when addToCart API fails so callers can skip success state', async () => {
    vi.mocked(cartLib.fetchCart).mockResolvedValue(EMPTY_CART);
    vi.mocked(cartLib.addToCart).mockRejectedValue(new Error('server error'));

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    await expect(
      act(async () => { await result.current.addToCart(42, 1); })
    ).rejects.toThrow();
  });

  it('does not throw when addToCart succeeds', async () => {
    vi.mocked(cartLib.fetchCart).mockResolvedValue(EMPTY_CART);
    vi.mocked(cartLib.addToCart).mockResolvedValue(CART_WITH_ITEM);

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    await expect(
      act(async () => { await result.current.addToCart(42, 1); })
    ).resolves.not.toThrow();
  });
});

// --- B3: lastAddedKey timer fires after API response ---
describe('B3 — lastAddedKey cleared after API response, not optimistic update', () => {
  it('lastAddedKey is still set immediately after optimistic update', async () => {
    vi.useFakeTimers();
    let resolveAdd!: (c: Cart) => void;
    vi.mocked(cartLib.fetchCart).mockResolvedValue(EMPTY_CART);
    vi.mocked(cartLib.addToCart).mockImplementation(
      () => new Promise((r) => { resolveAdd = r; })
    );

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => { await vi.runAllTimersAsync(); }); // flush initial fetch

    // Start addToCart (don't await - API is pending)
    act(() => { result.current.addToCart(42, 1); });

    // Immediately after optimistic update, lastAddedKey should be set
    expect(result.current.lastAddedKey).not.toBeNull();

    // Advance 800ms (old broken timer would fire and clear it here)
    await act(async () => { vi.advanceTimersByTime(800); });

    // lastAddedKey should still be set because API hasn't responded
    expect(result.current.lastAddedKey).not.toBeNull();

    // Now resolve the API
    await act(async () => { resolveAdd(CART_WITH_ITEM); });

    // After API resolves, lastAddedKey is the real key
    expect(result.current.lastAddedKey).toBe('real-key-1');

    // After 800ms from API response, it's cleared
    await act(async () => { vi.advanceTimersByTime(800); });
    expect(result.current.lastAddedKey).toBeNull();

    vi.useRealTimers();
  });
});
