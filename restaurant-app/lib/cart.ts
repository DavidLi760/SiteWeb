import { productsById, type Food } from "../data/menu";
export type { Food } from "../data/menu";

export const MAX_QUANTITY = 99;

export function clampQuantity(quantity: number) {
  return Math.min(MAX_QUANTITY, Math.max(1, quantity));
}
export type CartItem = Food & { quantity: number };

export function parseCart(saved: string | null): CartItem[] {
  try {
    const values: unknown = JSON.parse(saved ?? "[]");
    if (!Array.isArray(values)) return [];
    const items = new Map<number, CartItem>();
    for (const value of values) {
      const food = productsById.get(value?.id);
      if (!food || !Number.isInteger(value.quantity) || value.quantity < 1) continue;
      items.set(food.id, { ...food, quantity: clampQuantity((items.get(food.id)?.quantity ?? 0) + value.quantity) });
    }
    return [...items.values()];
  } catch {
    return [];
  }
}

export function addCartItem(cart: CartItem[], food: Food, quantity: number): CartItem[] {
  const existing = cart.find((item) => item.id === food.id);
  return existing
    ? setCartQuantity(cart, food.id, existing.quantity + quantity)
    : [...cart, { ...food, quantity: clampQuantity(quantity) }];
}

export function setCartQuantity(cart: CartItem[], id: number, quantity: number): CartItem[] {
  return cart.map((item) => item.id === id ? { ...item, quantity: clampQuantity(quantity) } : item);
}
