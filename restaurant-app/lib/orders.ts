import { products, productsById } from "../data/menu";
import { MAX_QUANTITY } from "./cart";
import { parseDeliveryAddress, type DeliveryAddress } from "./delivery-address";
import { toCents } from "./money";
import { isOrderType, type OrderType } from "./order-type";

export type OrderItem = { id: number; name: string; quantity: number; priceCents: number };
export type PreparedOrder = {
  orderType: OrderType;
  deliveryAddress: DeliveryAddress | null;
  items: OrderItem[];
  totalCents: number;
};

type OrderResult = { order: PreparedOrder; error?: never } | { error: string; order?: never };

export function parseOrder(value: unknown): OrderResult {
  if (!value || typeof value !== "object") return { error: "Commande invalide." };
  const body = value as Record<string, unknown>;
  if (!isOrderType(body.orderType)) return { error: "Choisissez Emporter ou Livraison." };

  const deliveryAddress = body.orderType === "delivery" ? parseDeliveryAddress(body.deliveryAddress) : null;
  if (body.orderType === "delivery" && !deliveryAddress) {
    return { error: "Veuillez renseigner une adresse de livraison complète et valide." };
  }
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > products.length) {
    return { error: "Panier vide ou invalide." };
  }

  const seen = new Set<number>();
  const items: OrderItem[] = [];
  let totalCents = 0;
  for (const value of body.items) {
    const item = value && typeof value === "object" ? value as Record<string, unknown> : null;
    const product = typeof item?.id === "number" ? productsById.get(item.id) : undefined;
    const quantity = item?.quantity;
    if (!product || typeof quantity !== "number" || !Number.isInteger(quantity) ||
        quantity < 1 || quantity > MAX_QUANTITY || seen.has(product.id)) {
      return { error: `Article invalide (quantité : 1 à ${MAX_QUANTITY}).` };
    }
    seen.add(product.id);
    const priceCents = toCents(product.price);
    items.push({ id: product.id, name: product.name, quantity, priceCents });
    totalCents += priceCents * quantity;
  }
  return { order: { orderType: body.orderType, deliveryAddress, items, totalCents } };
}
