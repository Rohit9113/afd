"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  addToCart,
  cartTotals,
  clearCart,
  getCartRaw,
  parseCart,
  removeFromCart,
  setCartQty,
  subscribeCart,
  type CartItem,
} from "@/data/cart";

/**
 * Cart ka data aur actions.
 *   const { items, count, total, add, setQty, remove, clear } = useCart();
 * Cart badalte hi ye hook use karne wale saare components apne aap update ho jate hain.
 */
export function useCart() {
  const raw = useSyncExternalStore(subscribeCart, getCartRaw, () => null);

  const items = useMemo<CartItem[]>(() => parseCart(raw), [raw]);
  const totals = useMemo(() => cartTotals(items), [items]);

  return {
    items,
    ...totals, // count, subtotal, savings, shipping, total
    add: addToCart,
    setQty: setCartQty,
    remove: removeFromCart,
    clear: clearCart,
  };
}