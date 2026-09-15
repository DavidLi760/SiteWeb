"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const InterceptedContext = createContext(false);

export function InterceptedAuth({ children }: { children: React.ReactNode }) {
  return <InterceptedContext.Provider value={true}>{children}</InterceptedContext.Provider>;
}

export default function AuthModal({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const intercepted = useContext(InterceptedContext);
  const close = () => intercepted ? router.back() : router.replace("/");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Votre compte Sushi House"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <button type="button" onClick={close} aria-label="Fermer" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-lime-50 hover:text-lime-800 focus-visible:outline-2 focus-visible:outline-lime-600">×</button>
        {children}
      </div>
    </dialog>
  );
}
