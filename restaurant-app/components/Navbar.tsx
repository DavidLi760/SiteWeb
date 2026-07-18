"use client"

import Link from "next/link"
import Menu from "./Menu"
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react"

export default function Navbar({ user }: { user: any }) {
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Gestion panier
  useEffect(() => {
    const updateCartCount = () => {
      const saved = localStorage.getItem("cart");

      let cart = [];

      try {
        cart = saved ? JSON.parse(saved) : [];
      } catch {
        cart = [];
      }

      const count = cart.reduce(
        (total: number, item: any) => total + (item.quantity || 0),
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <div className="flex flex-row justify-between items-center sm:h-[100px] h-[60px] px-4 bg-gradient-to-b from-[#4A4A4A] to-[#6A6A6A]">
      
      <Link href="/" className="flex items-center h-full">
        <img src="/SushiHouse.png" className="h-full" />
      </Link>

      <div className="flex gap-12">
        <Link className="hidden sm:flex text-white" href="/">
          Accueil
        </Link>

        {pathname === "/" && <Menu />}

        <Link className="hidden sm:flex text-white" href="/about">
          A propos
        </Link>
      </div>

      <div className="flex gap-4 sm:gap-12 relative text-white">

        <Link 
          href="/account" 
          className="flex border-2 border-white/30 rounded-full px-4 py-2"
        >
          <p className="hidden sm:block">
            {user ? user.firstname : "Compte"}
          </p>

          <i className="fa-solid fa-user text-2xl"></i>
        </Link>

        <Link 
          href="/cart" 
          className="flex text-white relative border-2 border-white/30 rounded-full px-4 py-2"
        >
          <p className="hidden sm:block">
            Panier
          </p>

          <i className="fa-solid fa-bag-shopping text-2xl"></i>

          <span className="absolute -top-2 -right-2 bg-red-600 text-black-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        </Link>

      </div>

    </div>
  );
}