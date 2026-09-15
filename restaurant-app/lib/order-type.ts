export type OrderType = "takeaway" | "delivery";

export function isOrderType(value: unknown): value is OrderType {
  return value === "takeaway" || value === "delivery";
}

export const orderTypeLabels: Record<OrderType, string> = {
  takeaway: "Emporter",
  delivery: "Livraison",
};
