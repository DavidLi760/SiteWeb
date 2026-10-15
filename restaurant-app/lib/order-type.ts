export const orderTypeLabels = {
  takeaway: "Emporter",
  delivery: "Livraison",
};

export type OrderType = keyof typeof orderTypeLabels;
export const orderTypes = Object.keys(orderTypeLabels) as OrderType[];

export function isOrderType(value: unknown): value is OrderType {
  return typeof value === "string" && orderTypes.includes(value as OrderType);
}
