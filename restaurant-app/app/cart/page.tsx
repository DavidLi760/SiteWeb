"use client";

import { parseDeliveryAddress, type DeliveryAddress } from "@/lib/delivery-address";
import OrderTypeSelector from "@/components/OrderTypeSelector";
import { useOrderType } from "@/lib/use-order-type";
import Image from "next/image";
import QuantitySelector from "@/components/QuantitySelector";
import { setCartQuantity } from "@/lib/cart";
import { formatMoney, toCents } from "@/lib/money";
import { useRef, useState } from "react";
import { useCart, saveCart } from "@/lib/use-cart";

export default function CartPage() {
  const cart = useCart();
  const orderType = useOrderType();

  const [address, setAddress] = useState<DeliveryAddress>({ street: "", postalCode: "", city: "", details: "" });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const sendingRef = useRef(false);

  const removeItem = (id: number) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const sendOrder = async () => {
    if (sendingRef.current || cart.length === 0) return;
    const deliveryAddress = orderType === "delivery" ? parseDeliveryAddress(address) : undefined;
    if (orderType === "delivery" && !deliveryAddress) {
      setMessage("Veuillez renseigner une adresse de livraison complète et valide.");
      return;
    }
    sendingRef.current = true;
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderType, deliveryAddress, items: cart.map(({ id, quantity }) => ({ id, quantity })) }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) saveCart([]);
    } catch {
      setMessage("Envoi non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon.");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + toCents(item.price) * item.quantity,
    0
  );

  return (
    <main className="bg-gray-100">
      <section aria-labelledby="cart-title" className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <h1 id="cart-title" className="mb-8 text-3xl font-bold sm:text-4xl">🛒 Mon panier</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LISTE PRODUITS */}
          <div className="min-w-0 rounded-xl bg-white p-4 shadow-lg sm:p-6 lg:col-span-2">
            <h2 className="mb-6 text-2xl font-semibold">
              Articles
            </h2>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Votre panier est vide 🍣
              </div>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="mb-4 grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-3 border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                  >
                    <Image width={96} height={96} alt={item.name}
                      src={item.image}
                      className="h-16 w-16 rounded-lg object-contain sm:h-24 sm:w-24"
                    />

                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex">
                        <QuantitySelector name={item.name} quantity={item.quantity} disabled={sending}
                          onChange={(quantity) => saveCart(setCartQuantity(cart, item.id, quantity))} />
                      </div>

                      <button
                        type="button"
                        disabled={sending}
                        onClick={() => removeItem(item.id)}
                        aria-label={`Supprimer ${item.name} du panier`}
                        className="mt-2 min-h-11 rounded text-sm text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-lime-600 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="col-start-2 whitespace-nowrap sm:col-start-3 sm:row-start-1 sm:text-right">
                      <p className="break-words text-lg font-bold">
                        {formatMoney(toCents(item.price) * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RESUME */}
          <form onSubmit={(event) => { event.preventDefault(); void sendOrder(); }} aria-labelledby="cart-summary-title" aria-busy={sending} className="h-fit min-w-0 rounded-xl bg-white p-4 shadow-lg sm:p-6">
            <h2 id="cart-summary-title" className="mb-6 text-2xl font-semibold">
              Résumé
            </h2>

            <div className="mb-3 flex justify-between gap-3">
              <span>Sous-total</span>
              <span>{formatMoney(total)}</span>
            </div>

            <OrderTypeSelector disabled={sending} />
            {orderType === "delivery" && (
              <fieldset disabled={sending} className="my-4 space-y-3">
                <legend className="mb-2 font-semibold">Adresse de livraison</legend>
                {([
                  { key: "street", label: "Numéro et rue", autocomplete: "address-line1", max: 200 },
                  { key: "postalCode", label: "Code postal", autocomplete: "postal-code", max: 20 },
                  { key: "city", label: "Ville", autocomplete: "address-level2", max: 100 },
                  { key: "details", label: "Complément (facultatif)", autocomplete: "address-line2", max: 300 },
                ] as const).map(({ key, label, autocomplete, max }) => (
                  <div key={key}>
                    <label htmlFor={`delivery-${key}`} className="block text-sm text-gray-700">{label}</label>
                    <input id={`delivery-${key}`} name={key} autoComplete={autocomplete}
                      required={key !== "details"} maxLength={max} value={address[key]}
                      onChange={(event) => setAddress((previous) => ({ ...previous, [key]: event.target.value }))}
                      className="mt-1 min-h-11 w-full min-w-0 rounded-lg border border-gray-300 px-3 focus:outline-2 focus:outline-lime-600"
                    />
                  </div>
                ))}
                <p className="text-xs leading-5 text-gray-600">Votre commande sera envoyée avec cette adresse de livraison.</p>
              </fieldset>
            )}

            <hr className="my-4" />

            <div className="mb-6 flex justify-between gap-3 text-xl font-bold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>

            <p className="mb-3 text-sm text-gray-600">Connectez-vous pour envoyer la commande au restaurant et recevoir une copie par email. Aucun paiement ne sera effectué.</p>
            <button type="submit" disabled={sending || cart.length === 0} className="min-h-12 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 disabled:cursor-not-allowed disabled:opacity-50">
              {sending ? "Envoi en cours…" : "Envoyer la commande"}
            </button>
            <p role="status" className="mt-3 text-sm">{message}</p>
          </form>
        </div>
      </section>
    </main>
  );
}
