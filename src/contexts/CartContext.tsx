import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../types/accessRequest';
import { PermissionLevel } from '../types/product';

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, permissionLevel?: PermissionLevel) => void;
  removeItem: (productId: string) => void;
  updatePermission: (productId: string, permissionLevel: PermissionLevel) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (productId: string, permissionLevel: PermissionLevel = 'READ') => {
    setItems((prev) =>
      prev.some((i) => i.productId === productId) ? prev : [...prev, { productId, permissionLevel }],
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updatePermission = (productId: string, permissionLevel: PermissionLevel) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, permissionLevel } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const isInCart = (productId: string) => items.some((i) => i.productId === productId);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updatePermission, clearCart, isInCart, count: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
