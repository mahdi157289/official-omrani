// Simple in-memory cart store
// In production, use Redis or a database table

export interface CartItem {
  id: string;
  productId?: string;
  packageId?: string;
  type?: 'product' | 'package';
  variantId?: string;
  quantity: number;
  addedAt: string;
}

export const cartStore = new Map<string, CartItem[]>();

export const getCart = (sessionId: string) => cartStore.get(sessionId) || [];

export const setCart = (sessionId: string, items: CartItem[]) => cartStore.set(sessionId, items);

export const clearCart = (sessionId: string) => cartStore.delete(sessionId);
