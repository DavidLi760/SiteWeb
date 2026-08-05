"use client";

import { menu } from "../data/menu";
import Category from "../components/Category";
import FoodCard from "../components/FoodCard";
import { useState, useEffect } from "react";

type Food = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartItem = Food & {
  quantity: number;
};

export default function Shop() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food: Food, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);

      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...food, quantity }];
    });
  };

  return (
    <>
      {menu.map((cat) => (
        <Category key={cat.category} title={cat.category} id={cat.category}>
          {cat.items.map((food) => (
            <div
              key={`${cat.category}-${food.id}`}
              onClick={() => {
                setSelectedFood(food);
                setQuantity(1);
              }}
            >
              <FoodCard
                name={food.name}
                price={food.price}
                image={food.image}
              />
            </div>
          ))}
        </Category>
      ))}

      {selectedFood && (
        <div
          className="fixed inset-0 bg-gray-500/30 flex items-center justify-center"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="bg-white p-6 rounded w-50 sm:w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">{selectedFood.name}</h2>

            <img
              src={selectedFood.image}
              className="w-full h-30 sm:h-48 object-cover"
            />

            <p className="mt-2">{selectedFood.price} €</p>

            <div className="mt-4 flex gap-3 text-gray-600">
              {/* Sélecteur de quantité */}
              <div className="flex items-center border rounded border-gray-300">
                <button
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>

                <span className="px-4 font-semibold">{quantity}</span>

                <button
                  className="px-3 cursor-pointer py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Ajouter au panier */}
              <button
                className="flex-1 cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => {
                  addToCart(selectedFood, quantity);
                  setSelectedFood(null);
                  setQuantity(1);
                  window.dispatchEvent(new Event("cartUpdated"));
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
