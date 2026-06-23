"use client"

import Link from "next/link"
import Menu from "./Menu"
import { usePathname } from "next/navigation";
import { useState } from "react"

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  return (
    
    <div className="flex flex-row justify-between items-center sm:h-[100px] h-[60px] px-4 bg-[#716969]">
      
      <Link href="/" className="flex items-center h-full">
        <img src="/SushiHouse.png" className="h-full" />
      </Link>

      <div className="flex gap-12">
        <Link className="hidden sm:flex text-white" href="/">Accueil</Link>
        {pathname === "/" && <Menu />}
        <Link className="hidden sm:flex text-white" href="/about">A propos</Link>
      </div>

      <div className="flex gap-12 relative text-white">
        <Link href="/account" className="flex">  
          <p className="hidden sm:block">
            Compte
          </p>
          <i className="fa-solid fa-user text-2xl"></i>
        </Link>

        <Link href="/cart" className="flex text-white">
          <p className="relative hidden sm:block">
            Panier{" "}
          </p>
          <i className="fa-solid fa-bag-shopping text-2xl"></i>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            0
          </span>
        </Link>
      </div>

    </div>
  );
}