import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import lobby from "@/public/lobby.png";
import { menu } from "@/data/menu";

export const metadata: Metadata = {
  title: "À propos | Sushi House",
  description: "Découvrez Sushi House, sa carte de sushis, makis et california, ses horaires et ses coordonnées.",
};

const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-8 sm:pt-12 lg:px-12">
      <section aria-labelledby="about-title" className="grid overflow-hidden rounded-3xl bg-gray-900 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Restaurant japonais</p>
          <h1 id="about-title" className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Bienvenue chez<br />
            <span className="text-lime-300">Sushi House.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-gray-300">
            Une pause déjeuner, un dîner à partager ou une envie de sushi :
            découvrez notre carte et composez un repas à votre goût.
          </p>
          <Link href="/#Sushi" className={`mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-xl bg-lime-300 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-lime-200 ${focusStyle}`}>
            Découvrir la carte <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="relative min-h-64 sm:min-h-80 lg:min-h-full">
          <Image src={lobby} alt="La salle du restaurant Sushi House" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section aria-labelledby="welcome-title" className="grid gap-6 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-700">L’esprit Sushi House</p>
          <h2 id="welcome-title" className="mt-3 max-w-md text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Le plaisir de choisir.<br />Le plaisir de partager.
          </h2>
        </div>
        <div className="space-y-4 text-base leading-8 text-gray-600">
          <p>
            Chez Sushi House, notre envie est simple : vous faire passer un bon moment
            autour de la cuisine japonaise. Que vous ayez vos incontournables ou envie
            de varier les saveurs, la carte vous laisse le choix.
          </p>
          <p>
            Sushi au saumon, maki au saumon ou california au saumon et à l’avocat :
            retrouvez vos préférés et associez-les selon vos envies.
          </p>
        </div>
      </section>

      <section aria-labelledby="menu-title">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-700">À la carte</p>
          <h2 id="menu-title" className="mt-3 text-3xl font-bold text-gray-900">À chacun ses envies</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {menu.map(({ category, items }) => (
            <Link key={category} href={`/#${encodeURIComponent(category)}`} className={`group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-lime-400 hover:bg-lime-50/50 ${focusStyle}`}>
              <Image src={items[0].image} alt={items[0].name} width={600} height={400} sizes="(min-width: 640px) 33vw, 100vw" className="h-40 w-full object-contain" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-lime-200 group-hover:text-gray-900">→</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-500">Découvrir la sélection</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-title" className="mt-14 grid gap-8 rounded-3xl border border-lime-200 bg-lime-50 p-7 sm:mt-20 sm:p-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-700">Gardons le contact</p>
          <h2 id="contact-title" className="mt-3 text-3xl font-bold text-gray-900">Une question avant de venir ?</h2>
          <p className="mt-4 max-w-md leading-7 text-gray-600">Appelez-nous pour en savoir plus sur la carte ou préparer votre visite.</p>
          <a href="tel:+33182457520" className={`mt-6 inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-lime-300 ${focusStyle}`}>
            <i aria-hidden="true" className="fa-solid fa-phone text-lime-300" />
            01 82 45 75 20
          </a>
        </div>
        <div className="self-center rounded-2xl border border-lime-200 bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900">Nos horaires</h3>
          <p className="mt-2 text-sm text-gray-500">Ouvert 6 jours sur 7</p>
          <dl className="mt-5 divide-y divide-gray-100 text-sm sm:text-base">
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-gray-600">Le midi</dt>
              <dd className="font-semibold text-gray-900">10h – 14h30</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-gray-600">Le soir</dt>
              <dd className="font-semibold text-gray-900">18h – 22h30</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
