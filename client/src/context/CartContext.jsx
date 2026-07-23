import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCart, saveCart } from "../lib/api";

const CartContext = createContext(null);
const STORAGE_KEY = "stagfencing_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function sameLine(a, b) {
  return a.slug === b.slug && JSON.stringify(a.selections || {}) === JSON.stringify(b.selections || {});
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(loadCart);
  const mergedForUserId = useRef(null);
  const prevUserId = useRef(undefined);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // On login, merge the guest (local) cart into the user's saved server cart once.
  useEffect(() => {
    if (!user || mergedForUserId.current === user._id) return;
    mergedForUserId.current = user._id;
    getCart()
      .then(({ items: serverItems }) => {
        setItems((localItems) => {
          const merged = [...serverItems];
          for (const local of localItems) {
            const idx = merged.findIndex((i) => sameLine(i, local));
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + local.quantity };
            } else {
              merged.push(local);
            }
          }
          return merged;
        });
      })
      .catch(() => {});
  }, [user]);

  // Keep the server copy up to date while logged in.
  useEffect(() => {
    if (!user) return;
    saveCart(items).catch(() => {});
  }, [items, user]);

  // Clear the local cart on logout — the authoritative copy stays on the server for next sign-in.
  useEffect(() => {
    const wasLoggedIn = !!prevUserId.current;
    if (wasLoggedIn && !user) {
      setItems([]);
      mergedForUserId.current = null;
    }
    prevUserId.current = user?._id || null;
  }, [user]);

  const addItem = (item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => sameLine(i, item));
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }
      return [...prev, { ...item, id: `${item.slug}-${Date.now()}` }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }),
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
