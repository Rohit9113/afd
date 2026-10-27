import type { Product } from "./products";
import { getSession, subscribeSession } from "./users";

/* ---------- Types & settings ---------- */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  size: string;
  emoji: string;
  color: string;
  image?: string;
  qty: number;
};

export const FREE_SHIPPING_MIN = 499; // is amount se upar shipping free
export const SHIPPING_FEE = 49;
export const MAX_QTY = 10; // ek product ki max quantity

/* ---------- Storage ----------
 * Har user ka cart alag save hota hai (demo_cart_<userId>), to logout/login par bhi bana rehta hai.
 */
const CART_PREFIX = "demo_cart_";
const CART_EVENT = "cart-change";

function cartKey(): string | null {
  const user = getSession();
  return user ? `${CART_PREFIX}${user.id}` : null;
}

// Raw string (useCart hook ke liye)
export function getCartRaw(): string | null {
  const key = cartKey();
  if (!key) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as CartItem[]) : [];
  } catch {
    return [];
  }
}

function readCart(): CartItem[] {
  return parseCart(getCartRaw());
}

function writeCart(items: CartItem[]) {
  const key = cartKey();
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT)); // Header badge turant update ho
  } catch {
    /* storage full ya blocked: ignore */
  }
}

// Cart badalne par (ya login/logout par) callback chalao
export function subscribeCart(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  const unsubscribeSession = subscribeSession(callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    unsubscribeSession();
  };
}

/* ---------- Actions ---------- */
export function addToCart(product: Product, qty = 1): boolean {
  if (!cartKey()) return false; // login nahi hai

  const items = readCart();
  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      size: product.size,
      emoji: product.emoji,
      color: product.color,
      image: product.image,
      qty: Math.min(MAX_QTY, qty),
    });
  }

  writeCart(items);
  return true;
}

export function setCartQty(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id);
  writeCart(readCart().map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)));
}

export function removeFromCart(id: string) {
  writeCart(readCart().filter((i) => i.id !== id));
}

export function clearCart() {
  writeCart([]);
}

/* ---------- Totals ---------- */
export function cartTotals(items: CartItem[]) {
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const savings = items.reduce((n, i) => n + (i.oldPrice ? (i.oldPrice - i.price) * i.qty : 0), 0);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  return { count, subtotal, savings, shipping, total };
}