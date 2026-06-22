"use client"

import { menu } from "../data/menu";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block group">
      <button onClick={() => setOpen(!open)} className="text-white hover:text-pink-100">
        Menu
      </button>

      {open && (<div className="absolute left-0 top-full w-48 rounded border bg-white shadow-lg">
        {menu.map((category) => (
          <a
            key={category.category}
            href={`#${category.category}`}
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            {category.category}
          </a>
        ))}
      </div>)}
    </div>
  );
}