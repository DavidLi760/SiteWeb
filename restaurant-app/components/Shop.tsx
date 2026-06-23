"use client"

import { menu } from "../data/menu"
import Category from "../components/Category"
import FoodCard from "../components/FoodCard"
import { useState } from "react";

type Food = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Shop() {
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    return (
        <>
            {menu.map((cat) => (
                <Category key={cat.category} title={cat.category} id={cat.category} >
                {cat.items.map((food) => (
                    <div key={`${cat.category}-${food.id}`} onClick={() => setSelectedFood(food)}>
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

                 <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full">
                   Acheter
                 </button>

                 <button
                   className="mt-2 bg-red-500 text-white px-4 py-2 rounded w-full"
                   onClick={() => setSelectedFood(null)}
                 >
                   Fermer
                 </button>
               </div>
             </div>
            )}
        </>
    )
}