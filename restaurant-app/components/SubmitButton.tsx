import type { ComponentProps } from "react";

export default function SubmitButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="submit"
      className={`min-h-12 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
