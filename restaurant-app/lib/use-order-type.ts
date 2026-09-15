"use client";

import { useSyncExternalStore } from "react";
import { isOrderType, type OrderType } from "./order-type";

function snapshot(): OrderType {
  try {
    const value = localStorage.getItem("orderType");
    return isOrderType(value) ? value : "takeaway";
  } catch {
    return "takeaway";
  }
}

function subscribe(listener: () => void) {
  window.addEventListener("orderTypeUpdated", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("orderTypeUpdated", listener);
    window.removeEventListener("storage", listener);
  };
}

export function setOrderType(value: OrderType) {
  try {
    localStorage.setItem("orderType", value);
    window.dispatchEvent(new Event("orderTypeUpdated"));
  } catch {
    alert("Impossible de mémoriser ce choix. Autorisez le stockage dans votre navigateur.");
  }
}

export function useOrderType() {
  return useSyncExternalStore(subscribe, snapshot, () => "takeaway" as OrderType);
}
