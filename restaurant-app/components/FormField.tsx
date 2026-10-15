import type { ComponentProps } from "react";

type FormFieldProps = ComponentProps<"input"> & { id: string; label: string };

export default function FormField({ id, label, className = "", ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={id}
        className={`mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600 ${className}`}
        {...props}
      />
    </div>
  );
}
