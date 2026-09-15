"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";


export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    
    
      const data = await res.json();
    
    
      if (data.success) {
        alert("Connexion réussie !");
        router.push("/");
        router.refresh();
      } else {
        alert(data.message);
      }
    
    
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  return (
    <>
    <AuthModal>
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

        <span aria-hidden="true" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
            <i className="fa-solid fa-user" />
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Connexion
        </h1>
          <p className="mt-4 leading-7 text-gray-600">Connectez-vous pour retrouver votre compte et envoyer votre commande.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email"
              type="email"
              className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
            <input id="password"
              type="password"
              className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link replace
              href="/forgot-password"
              className="text-sm rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600"
          >
            Se connecter
          </button>
        </form>

        {/* Optional register */}
        <p className="mt-6 text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link replace href="/signup" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">
            Créer un compte
          </Link>
        </p>

      </div>
    </AuthModal>
    </>
  );
}