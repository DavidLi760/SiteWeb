"use client";

export function createLocalStore(key: string, eventName: string, errorMessage: string) {
  return {
    snapshot(): string | null {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    subscribe(listener: () => void) {
      window.addEventListener(eventName, listener);
      window.addEventListener("storage", listener);
      return () => {
        window.removeEventListener(eventName, listener);
        window.removeEventListener("storage", listener);
      };
    },
    save(value: string) {
      try {
        localStorage.setItem(key, value);
        window.dispatchEvent(new Event(eventName));
      } catch {
        alert(errorMessage);
      }
    },
  };
}
