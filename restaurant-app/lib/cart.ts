import { menu } from "../data/menu";

export type Food = (typeof menu)[number]["items"][number];
export type CartItem = Food & { quantity: number };

export function parseCart(saved: string | null): CartItem[] {
  try {
    const values: unknown = JSON.parse(saved ?? "[]");
    if (!Array.isArray(values)) return [];
    const items = new Map<number, CartItem>();
    for (const value of values) {
      const food = menu.flatMap((category) => category.items).find((food) => food.id === value?.id);
      if (!food || !Number.isInteger(value.quantity) || value.quantity < 1) continue;
      items.set(food.id, { ...food, quantity: Math.min(99, (items.get(food.id)?.quantity ?? 0) + value.quantity) });
    }
    return [...items.values()];
  } catch {
    return [];
  }
}
