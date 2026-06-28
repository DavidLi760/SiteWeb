"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");

    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

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

                    <p className="text-gray-500">
                      Quantité : {item.quantity}
                    </p>
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

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Passer au paiement
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}