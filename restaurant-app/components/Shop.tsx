"use client";

import Image from "next/image";
import { menu } from "../data/menu";
import Category from "../components/Category";
import FoodCard from "../components/FoodCard";
import { useState } from "react";
import { useCart, saveCart } from "@/lib/use-cart";
import type { Food } from "@/lib/cart";

export default function Shop() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const addToCart = (food: Food, quantity: number) => {
    const existing = cart.find((item) => item.id === food.id);
    saveCart(existing
      ? cart.map((item) => item.id === food.id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item)
      : [...cart, { ...food, quantity }]);
  };

  return (
    <>
      {menu.map((cat) => (
        <Category key={cat.category} title={cat.category} id={cat.category}>
          {cat.items.map((food) => (
            <button
              type="button"
              className="min-w-0 text-left"
              key={`${cat.category}-${food.id}`}
              onClick={() => {
                setSelectedFood(food);
                setQuantity(1);
              }}
            >
              <FoodCard
                name={food.name}
                description={food.description}
                price={food.price}
                image={food.image}
              />
            </button>
          ))}
        </Category>
      ))}

      {selectedFood && (
        <div
          className="fixed inset-0 z-[60] bg-gray-500/30 flex items-center justify-center p-4"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="bg-white p-6 rounded w-full max-w-80 max-h-[calc(100dvh-2rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setSelectedFood(null)} className="float-right" aria-label="Fermer">×</button>
            <h2 className="text-xl font-bold">{selectedFood.name}</h2>

            <Image width={600} height={400} alt={selectedFood.name}
              src={selectedFood.image}
              className="w-full h-30 sm:h-48 object-contain"
            />

            <p className="mt-2">{selectedFood.price} €</p>

            <div className="mt-4 flex flex-col gap-3 text-gray-600 sm:flex-row">
              {/* Sélecteur de quantité */}
              <div className="flex shrink-0 items-center justify-center self-center border rounded border-gray-300">
                <button
                  type="button"
                  aria-label={`Diminuer la quantité de ${selectedFood.name}`}
                  disabled={quantity <= 1}
                  className="min-h-11 min-w-11 cursor-pointer rounded-l bg-rose-700 px-3 py-2 text-xl font-bold text-white transition-colors enabled:hover:bg-rose-800 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>

                <span className="px-4 font-semibold">{quantity}</span>

                <button
                  type="button"
                  aria-label={`Augmenter la quantité de ${selectedFood.name}`}
                  disabled={quantity >= 99}
                  className="min-h-11 min-w-11 cursor-pointer rounded-r bg-emerald-700 px-3 py-2 text-xl font-bold text-white transition-colors enabled:hover:bg-emerald-800 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                >
                  +
                </button>
              </div>

              {/* Ajouter au panier */}
              <button
                className="min-h-11 min-w-0 w-full sm:w-auto sm:flex-1 cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => {
                  addToCart(selectedFood, quantity);
                  setSelectedFood(null);
                  setQuantity(1);
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
