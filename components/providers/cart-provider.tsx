'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
  productSlug: string;
  productImage: string;
  price: number;
  total: number;
  variantName?: string | null;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  total: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (itemId: string, quantity?: number, variantId?: string, type?: 'product' | 'package') => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  // Prevent SSR rendering - only render on client
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    // #region agent log (avoid render-time side effects)
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const browserInfo = typeof navigator !== 'undefined' ? {
        isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
        isEdge: /Edg/.test(navigator.userAgent),
        chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
      } : {};
      fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'cart-provider.tsx:useEffect',
          message: 'CartProvider mounted',
          data: { locale, mounted, hasWindow: typeof window !== 'undefined', hasDocument: typeof document !== 'undefined', ...browserInfo },
          timestamp: Date.now(),
          hypothesisId: 'A,B,C,F',
          runId: 'post-fix',
        }),
      }).catch(() => {});
    }
    // #endregion
  }, [locale, mounted]);
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/cart?sessionId=default&locale=${locale}`);
      const data = await res.json();
      setItems(data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    // Only fetch cart when mounted on client
    if (mounted) {
      fetchCart();
    }
  }, [fetchCart, mounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = async (itemId: string, quantity: number = 1, variantId?: string, type: 'product' | 'package' = 'product') => {
    try {
      setIsLoading(true);

      const body: any = {
        sessionId: 'default',
        quantity,
        variantId,
        type
      };

      if (type === 'product') {
        body.productId = itemId;
      } else {
        body.packageId = itemId;
      }

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsLoading(false); // release button immediately
        setIsOpen(true);     // open sidebar on add
        // refresh cart in background silently (no await)
        fetch(`/api/cart?sessionId=default&locale=${locale}`)
          .then(r => r.json())
          .then(data => setItems(data.cart || []))
          .catch(err => console.error('Silent refresh failed:', err));

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          quantity: 0,
          sessionId: 'default',
        }),
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          quantity,
          sessionId: 'default',
        }),
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const clearCart = () => {
    setItems([]);
    // Ideally call API to clear
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue = {
    items,
    isOpen,
    isLoading,
    total,
    itemCount,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  
  // Return empty provider during SSR to prevent hydration mismatches
  if (!mounted) {
    return (
      <CartContext.Provider
        value={{
          items: [],
          isOpen: false,
          isLoading: false,
          total: 0,
          itemCount: 0,
          openCart: () => {},
          closeCart: () => {},
          toggleCart: () => {},
          addToCart: async () => false,
          removeFromCart: async () => {},
          updateQuantity: async () => {},
          clearCart: () => {},
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }
  
  return (
    <CartContext.Provider
      value={contextValue}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
