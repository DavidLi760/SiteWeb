"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Dialog from "./Dialog";

const InterceptedContext = createContext(false);

export function InterceptedAuth({ children }: { children: ReactNode }) {
  return <InterceptedContext.Provider value={true}>{children}</InterceptedContext.Provider>;
}

export default function AuthModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const intercepted = useContext(InterceptedContext);
  const close = () => intercepted ? router.back() : router.replace("/");

  return (
    <Dialog label="Votre compte Sushi House" onClose={close} className="max-w-xl rounded-3xl p-0">
      <div className="relative">
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-lime-50 hover:text-lime-800 focus-visible:outline-2 focus-visible:outline-lime-600"
        >
          ×
        </button>
        {children}
      </div>
    </Dialog>
  );
}
