import Link from "next/link";
import type { ReactNode } from "react";

export default function InformationPage({ title, description, current, children }: {
  title: string;
  description: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-8 sm:px-8 sm:pt-12">
      <header className="rounded-3xl bg-gray-900 p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-lime-300">Sushi House · Informations</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 leading-7 text-gray-300">{description}</p>
      </header>
      <nav aria-label="Pages d’information" className="my-6 flex flex-wrap gap-3">
        {[
          { href: "/legal", label: "Mentions légales" },
          { href: "/privacy", label: "Confidentialité" },
          { href: "/cookies", label: "Cookies" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} aria-current={current === href ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${current === href ? "border-lime-300 bg-lime-100 text-lime-900" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-8 rounded-3xl border border-gray-200 bg-white p-6 leading-7 text-gray-700 sm:p-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_p+p]:mt-3 [&_a]:rounded [&_a]:text-lime-800 [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-lime-700">
        {children}
      </div>
    </main>
  );
}
