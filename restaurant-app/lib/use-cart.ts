"use client";

import { useSyncExternalStore } from "react";
import { parseCart, type CartItem } from "./cart";

function snapshot() {
  try {
    return localStorage.getItem("cart");
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener("cartUpdated", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("cartUpdated", listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch {
    alert("Impossible d’enregistrer le panier. Autorisez le stockage dans votre navigateur.");
  }
}

export function useCart() {
  return parseCart(useSyncExternalStore(subscribe, snapshot, () => null));
}
