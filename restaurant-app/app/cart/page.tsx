"use client";

import { useEffect, useRef, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const sendingRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");

    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQuantity = (id: number, change: number) => {
    saveCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

const removeItem = (id: number) => {
  saveCart(cart.filter((item) => item.id !== id));
};

  const sendOrder = async () => {
    if (sendingRef.current || cart.length === 0) return;
    sendingRef.current = true;
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) }),
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
                  <img
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
    disabled={sending}
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
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-6">
              Résumé
            </h2>

            <div className="flex justify-between mb-3">
              <span>Sous-total</span>
              <span>{total} €</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>{total} €</span>
            </div>

            <p className="text-sm text-gray-600 mb-3">Connectez-vous pour envoyer la commande au restaurant et recevoir une copie par email. Aucun paiement ne sera effectué.</p>
            <button onClick={sendOrder} disabled={sending || cart.length === 0} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
              {sending ? "Envoi en cours…" : "Envoyer la commande"}
            </button>
            <p role="status" className="mt-3 text-sm">{message}</p>
          </div>
        </div>
      </section>

    </main>
  );
}