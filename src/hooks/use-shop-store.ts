import { useEffect, useState } from "react";

type CartItem = { productId: string; qty: number };

const CART_KEY = "karama-cart";
const WISH_KEY = "karama-wishlist";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`store:${key}`));
}

function useStore<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read(key, fallback));
    const onChange = () => setValue(read(key, fallback));
    window.addEventListener(`store:${key}`, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(`store:${key}`, onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = (v: T | ((prev: T) => T)) => {
    const next = typeof v === "function" ? (v as (p: T) => T)(read(key, fallback)) : v;
    write(key, next);
    setValue(next);
  };
  return [value, set];
}

export function useCart() {
  const [items, setItems] = useStore<CartItem[]>(CART_KEY, []);
  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    add: (productId: string, qty = 1) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { productId, qty }];
      }),
    updateQty: (productId: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
      ),
    remove: (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
    clear: () => setItems([]),
  };
}

export function useWishlist() {
  const [items, setItems] = useStore<string[]>(WISH_KEY, []);
  return {
    items,
    count: items.length,
    has: (id: string) => items.includes(id),
    toggle: (id: string) =>
      setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    remove: (id: string) => setItems((prev) => prev.filter((x) => x !== id)),
    clear: () => setItems([]),
  };
}
