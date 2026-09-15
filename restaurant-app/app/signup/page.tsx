"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        phone,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Compte créé ! Vérifie ton email pour confirmer ton adresse.");
    } else {
      alert(data.message || "Erreur lors de la création du compte.");
    }

  } catch (error) {
    console.error(error);
    alert("Impossible de contacter le serveur.");
  }
};

  return (
    <>

      <AuthModal>
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

          <span aria-hidden="true" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
            <i className="fa-solid fa-user-plus" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-lime-700">Votre compte Sushi House</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Créer un compte
          </h1>
          <p className="mt-4 leading-7 text-gray-600">Créez votre compte pour préparer votre prochaine commande.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>

              <input id="email"
                type="email"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
              />
            </div>

            <div>
              <label htmlFor="firstname" className="block text-sm font-medium">
                Prénom
              </label>

              <input id="firstname"
                type="text"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="ex: Jean"
                required
              />
            </div>


            <div>
              <label htmlFor="lastname" className="block text-sm font-medium">
                Nom
              </label>

              <input id="lastname"
                type="text"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="ex: Dupont"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Numéro de téléphone
              </label>
              
              <input id="phone"
                type="tel"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ex: +33 6 12 34 56 78"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>

              <input id="password"
                type="password"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmer le mot de passe
              </label>

              <input id="confirmPassword"
                type="password"
                className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600"
            >
              Créer mon compte
            </button>

          </form>

          <p className="mt-6 text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link replace
              href="/account"
              className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600"
            >
              Se connecter
            </Link>
          </p>

        </div>
      </AuthModal>
    </>
  );
}