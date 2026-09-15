"use client";

import { orderTypeLabels, type OrderType } from "@/lib/order-type";
import { setOrderType, useOrderType } from "@/lib/use-order-type";

export default function OrderTypeSelector({ disabled = false }: { disabled?: boolean }) {
  const orderType = useOrderType();
  return (
    <div role="group" aria-label="Mode de commande" className="flex flex-wrap justify-center gap-3 py-4">
      {(["takeaway", "delivery"] as OrderType[]).map((value) => (
        <button key={value} type="button" disabled={disabled} aria-pressed={orderType === value}
          onClick={() => setOrderType(value)}
          className={`min-h-12 rounded-xl border px-6 py-3 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 disabled:opacity-50 ${orderType === value ? "border-black bg-gradient-to-b from-[#68b000] to-[#70e000] text-black" : "border-gray-300 bg-white text-gray-700 hover:border-lime-500 hover:bg-lime-50"}`}>
          {orderTypeLabels[value]}
        </button>
      ))}
    </div>
  );
}
