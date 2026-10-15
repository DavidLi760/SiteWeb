"use client";

import { useSyncExternalStore } from "react";
import { isOrderType, type OrderType } from "./order-type";
import { createLocalStore } from "./local-store";

const store = createLocalStore("orderType", "orderTypeUpdated", "Impossible de mémoriser ce choix. Autorisez le stockage dans votre navigateur.");

export function setOrderType(value: OrderType) {
  store.save(value);
}

export function useOrderType(): OrderType {
  const value = useSyncExternalStore(store.subscribe, store.snapshot, () => null);
  return isOrderType(value) ? value : "takeaway";
}
