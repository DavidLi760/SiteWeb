import type { ReactNode } from "react";

type CategoryProps = {
  title: string;
  id: string;
  children: ReactNode;
};

export default function Category({ title, id, children }: CategoryProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-28">
      <h2 id={`${id}-title`} className="mb-4 text-center text-3xl font-bold sm:text-5xl">{title}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
