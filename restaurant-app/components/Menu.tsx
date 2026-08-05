"use client"

import { menu } from "../data/menu";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block group">
      <button onClick={() => setOpen(!open)} className="cursor-pointer text-white font-bold hover:text-yellow-100">
        Menu
      </button>

      {open && (<div className="absolute left-1/2 top-full -translate-x-1/2 w-48 rounded border bg-white shadow-lg divide-y divide-gray-200">
        {menu.map((category) => (
          <a
            key={category.category}
            href={`#${category.category}`}
            className="block px-4 py-2 hover:bg-gray-100 text-center"
            onClick={() => setOpen(false)}
          >
            {category.category}
          </a>
        ))}
      </div>)}
    </div>
  );
}