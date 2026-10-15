"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./Menu";
import { useCart } from "@/lib/use-cart";
import type { Session } from "@/lib/auth";

export default function Navbar({ user }: { user: Session | null }) {
  const cartCount = useCart().reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();
  const actionStyle = "relative flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 border-white/30 px-3 py-2 transition-colors hover:border-lime-300/50 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 sm:px-4";

  return (
    <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center justify-between gap-3 bg-gradient-to-b from-[#4a4a4a] to-[#6a6a6a] px-4 text-white sm:h-25">
      <Link href="/" className="flex h-full min-w-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">
        <Image width={240} height={100} alt="Sushi House — Accueil" src="/SushiHouse.png" className="h-full w-auto max-w-full object-contain" />
      </Link>

      <nav aria-label="Navigation principale" className="flex shrink-0 items-center gap-[clamp(0.5rem,2vw,3rem)]">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="hidden min-h-11 items-center rounded font-bold hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-lime-300 sm:flex">
          Accueil
        </Link>
        {pathname === "/" && <Menu />}
        <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} className="hidden min-h-11 items-center rounded font-bold hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-lime-300 sm:flex">
          À propos
        </Link>
      </nav>

      <nav aria-label="Compte et panier" className="flex shrink-0 gap-[clamp(0.5rem,2vw,3rem)]">
        <Link aria-label={user ? `Compte de ${user.firstname}` : "Compte"} href="/account" className={actionStyle}>
          <span className="hidden max-w-32 truncate lg:block">{user ? user.firstname : "Compte"}</span>
          <i aria-hidden="true" className="fa-solid fa-user text-2xl" />
        </Link>
        <Link aria-label={`Panier, ${cartCount} articles`} href="/cart" className={actionStyle}>
          <span className="hidden lg:block">Panier</span>
          <i aria-hidden="true" className="fa-solid fa-bag-shopping text-2xl" />
          <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
            {cartCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}
