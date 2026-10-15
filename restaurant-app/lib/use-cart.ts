"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseCart, type CartItem } from "./cart";
import { createLocalStore } from "./local-store";

const store = createLocalStore("cart", "cartUpdated", "Impossible d’enregistrer le panier. Autorisez le stockage dans votre navigateur.");

export function saveCart(cart: CartItem[]) {
  store.save(JSON.stringify(cart));
}

export function useCart() {
  const saved = useSyncExternalStore(store.subscribe, store.snapshot, () => null);
  return useMemo(() => parseCart(saved), [saved]);
}
