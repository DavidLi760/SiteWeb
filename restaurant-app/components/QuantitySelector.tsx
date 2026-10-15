import { clampQuantity, MAX_QUANTITY } from "@/lib/cart";

export default function QuantitySelector({ name, quantity, onChange, disabled = false }: {
  name: string;
  quantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}) {
  const buttonStyle = "min-h-11 min-w-11 cursor-pointer px-3 py-2 text-xl font-bold text-white transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600";
  return (
    <div className="flex shrink-0 items-center justify-center self-center border rounded border-gray-300">
      <button
        type="button"
        aria-label={`Diminuer la quantité de ${name}`}
        disabled={disabled || quantity <= 1}
        className={`${buttonStyle} rounded-l bg-rose-700 enabled:hover:bg-rose-800 focus-visible:outline-rose-700`}
        onClick={() => onChange(clampQuantity(quantity - 1))}
      >−</button>
      <span className="px-4 font-semibold">{quantity}</span>
      <button
        type="button"
        aria-label={`Augmenter la quantité de ${name}`}
        disabled={disabled || quantity >= MAX_QUANTITY}
        className={`${buttonStyle} rounded-r bg-emerald-700 enabled:hover:bg-emerald-800 focus-visible:outline-emerald-700`}
        onClick={() => onChange(clampQuantity(quantity + 1))}
      >+</button>
    </div>
  );
}
