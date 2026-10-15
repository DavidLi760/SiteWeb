"use client";

import Image from "next/image";
import Dialog from "./Dialog";
import { menu } from "../data/menu";
import Category from "../components/Category";
import FoodCard from "../components/FoodCard";
import { useState } from "react";
import { useCart, saveCart } from "@/lib/use-cart";
import { addCartItem, type Food } from "@/lib/cart";
import QuantitySelector from "./QuantitySelector";
import { formatMoney, toCents } from "@/lib/money";

export default function Shop() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {menu.map((cat) => (
        <Category key={cat.category} title={cat.category} id={cat.category}>
          {cat.items.map((food) => (
            <button
              type="button"
              className="group min-w-0 cursor-pointer rounded text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600"
              aria-haspopup="dialog"
              key={`${cat.category}-${food.id}`}
              onClick={() => {
                setSelectedFood(food);
                setQuantity(1);
              }}
            >
              <FoodCard {...food} />
            </button>
          ))}
        </Category>
      ))}

      {selectedFood && (
        <Dialog label={selectedFood.name} onClose={() => setSelectedFood(null)} className="max-w-80 rounded-xl p-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSelectedFood(null)}
              className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-lime-600"
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="pr-8 text-xl font-bold">{selectedFood.name}</h2>

            <Image
              width={600}
              height={400}
              sizes="272px"
              alt=""
              src={selectedFood.image}
              className="h-30 w-full object-contain sm:h-48"
            />

            <p className="mt-2">{formatMoney(toCents(selectedFood.price))}</p>

            <div className="mt-4 flex flex-col gap-3 text-gray-600 sm:flex-row">
              {/* Sélecteur de quantité */}
              <QuantitySelector name={selectedFood.name} quantity={quantity} onChange={setQuantity} />

              {/* Ajouter au panier */}
              <button
                type="button"
                className="min-h-11 w-full min-w-0 cursor-pointer rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 sm:w-auto sm:flex-1"
                onClick={() => {
                  saveCart(addCartItem(cart, selectedFood, quantity));
                  setSelectedFood(null);
                  setQuantity(1);
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
