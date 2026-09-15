"use client"

import Image from "next/image";
import Link from "next/link"
import Menu from "./Menu"
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/use-cart";
import type { Session } from "@/lib/auth";

export default function Navbar({ user }: { user: Session | null }) {
  const cartCount = useCart().reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();

  return (
    <div className="flex flex-row justify-between items-center gap-3 sm:h-[100px] h-[60px] px-4 bg-gradient-to-b from-[#4A4A4A] to-[#6A6A6A] sticky top-0 z-50">
      
      <Link href="/" className="flex min-w-0 shrink items-center h-full">
        <Image width={240} height={100} alt="Sushi House" src="/SushiHouse.png" className="h-full w-auto max-w-full object-contain" />
      </Link>

      <div className="flex items-center gap-[clamp(0.5rem,2vw,3rem)] flex-shrink-0">
        <Link href="/" className="hidden hover:text-lime-300 font-bold sm:flex text-white">
          Accueil
        </Link>

        {pathname === "/" && <Menu />}

        <Link href="/about" className="hidden hover:text-lime-300 font-bold sm:flex text-white flex-shrink-0">
          A propos
        </Link>
      </div>

      <div className="flex gap-[clamp(0.5rem,2vw,3rem)] relative text-white flex-shrink-0">

        <Link 
          aria-label={user ? `Compte de ${user.firstname}` : "Compte"}
          href="/account" 
          className="flex hover:text-lime-300 hover:border-lime-300/50 border-2 border-white/30 rounded-full px-4 py-2 flex-shrink-0"
        >
          <p className="hidden lg:block max-w-32 truncate">
            {user ? user.firstname : "Compte"}
          </p>

          <i className="fa-solid fa-user text-2xl"></i>
        </Link>

        <Link 
          aria-label={`Panier, ${cartCount} articles`}
          href="/cart" 
          className="flex hover:text-lime-300 hover:border-lime-300/50 text-white relative border-2 border-white/30 rounded-full px-4 py-2"
        >
          <p className="hidden lg:block max-w-32 truncate">
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
