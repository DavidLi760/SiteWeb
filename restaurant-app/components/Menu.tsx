"use client";

import { menu } from "../data/menu";
import { useEffect, useId, useRef, useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 font-bold transition-colors hover:bg-white/10 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 ${open ? "bg-white/10 text-lime-300" : "text-white"}`}
      >
        Menu
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-1/2 top-full z-10 mt-3 w-52 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-black/15"
      >
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Notre carte
        </p>
        <ul className="space-y-1">
          {menu.map(({ category }) => (
            <li key={category}>
              <a
                href={`/#${encodeURIComponent(category)}`}
                className="group flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-lime-50 hover:text-lime-900 focus-visible:bg-lime-50 focus-visible:outline-2 focus-visible:outline-lime-600"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
              >
                {category}
                <span aria-hidden="true" className="text-gray-400 transition-colors group-hover:text-lime-700">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
