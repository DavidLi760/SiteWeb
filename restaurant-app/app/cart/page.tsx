"use client";

import { parseDeliveryAddress, type DeliveryAddress } from "@/lib/delivery-address";
import OrderTypeSelector from "@/components/OrderTypeSelector";
import { useOrderType } from "@/lib/use-order-type";
import Image from "next/image";
import { useRef, useState } from "react";
import { useCart, saveCart } from "@/lib/use-cart";

export default function CartPage() {
  const cart = useCart();
  const orderType = useOrderType();

  const [address, setAddress] = useState<DeliveryAddress>({ street: "", postalCode: "", city: "", details: "" });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const sendingRef = useRef(false);

  const changeQuantity = (id: number, change: number) => {
    saveCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(99, Math.max(1, item.quantity + change)) }
          : item
      )
    );
  };

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
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">

      <section className="flex-1 max-w-5xl mx-auto w-full p-6">
        <h1 className="text-4xl font-bold mb-8">🛒 Mon panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LISTE PRODUITS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Articles
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Votre panier est vide 🍣
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4 mb-4"
                >
                  <Image width={96} height={96} alt={item.name}
                    src={item.image}
                    className="w-24 h-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
  <button
    type="button"
    onClick={() => changeQuantity(item.id, -1)}
    disabled={sending || item.quantity <= 1}
    aria-label={`Diminuer la quantité de ${item.name}`}
    className="border rounded px-3 py-1 disabled:opacity-40"
  >
    −
  </button>

  <span>{item.quantity}</span>

  <button
    type="button"
    disabled={sending || item.quantity >= 99}
    onClick={() => changeQuantity(item.id, 1)}
    aria-label={`Augmenter la quantité de ${item.name}`}
    className="border rounded px-3 py-1"
  >
    +
  </button>
</div>

<button
  type="button"
  disabled={sending}
  onClick={() => removeItem(item.id)}
  aria-label={`Supprimer ${item.name} du panier`}
  className="text-red-600 hover:underline text-sm mt-2"
>
  Supprimer
</button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {item.price * item.quantity} €
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RESUME */}
          <form onSubmit={(event) => { event.preventDefault(); void sendOrder(); }} className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-6">
              Résumé
            </h2>

            <div className="flex justify-between mb-3">
              <span>Sous-total</span>
              <span>{total} €</span>
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

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>{total} €</span>
            </div>

            <p className="text-sm text-gray-600 mb-3">Connectez-vous pour envoyer la commande au restaurant et recevoir une copie par email. Aucun paiement ne sera effectué.</p>
            <button type="submit" disabled={sending || cart.length === 0} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
              {sending ? "Envoi en cours…" : "Envoyer la commande"}
            </button>
            <p role="status" className="mt-3 text-sm">{message}</p>
          </form>
        </div>
      </section>

    </main>
  );
}