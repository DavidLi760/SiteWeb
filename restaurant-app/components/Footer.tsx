import { restaurant, informationLinks } from "@/data/restaurant";
import Link from "next/link";

const paymentMethods = [
  { label: "Espèces", icon: "fa-coins" },
  { label: "Carte bancaire", icon: "fa-credit-card" },
  { label: "Ticket restaurant", icon: "fa-ticket" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-lime-500 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-block rounded text-2xl font-bold tracking-wide text-white transition-colors hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            >
              SUSHI HOUSE<span className="text-lime-400">.</span>
            </Link>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-lime-300">
              Restaurant japonais
            </p>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Retrouvez vos sushis, makis et california préférés.
            </p>
          </div>

          <section aria-labelledby="footer-contact" className="min-w-0">
            <h2 id="footer-contact" className="text-base font-semibold text-white">
              Contact & horaires
            </h2>
            <a
              href={restaurant.phoneHref}
              className="mt-5 inline-flex items-center gap-3 rounded text-lg font-medium text-white transition-colors hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            >
              <i aria-hidden="true" className="fa-solid fa-phone text-sm text-lime-400" />
              {restaurant.phone}
            </a>
            <div className="mt-4 flex items-start gap-3 text-sm leading-7">
              <i aria-hidden="true" className="fa-regular fa-clock mt-2 text-lime-400" />
              <div>
                <p className="font-medium text-gray-200">{restaurant.openingDays}</p>
                {restaurant.hours.map(({ label, time }) => (
                  <p key={label}>{time}</p>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="footer-payment" className="min-w-0">
            <h2 id="footer-payment" className="text-base font-semibold text-white">
              Moyens de paiement
            </h2>
            <ul className="mt-5 space-y-3">
              {paymentMethods.map(({ label, icon }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lime-300">
                    <i aria-hidden="true" className={`fa-solid ${icon}`} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Informations légales" className="min-w-0">
            <h2 className="text-base font-semibold text-white">Informations</h2>
            <ul className="mt-5 space-y-4 text-sm">
              {informationLinks.map(({ href, label, footerLabel }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded transition-colors hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
                  >
                    {footerLabel ?? label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-6 text-gray-400 sm:text-left">
          © {new Date().getFullYear()} Sushi House. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
