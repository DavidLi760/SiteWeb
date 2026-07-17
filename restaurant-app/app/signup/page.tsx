"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
      alert("Erreur lors de la création du compte.");
    }

  } catch (error) {
    console.error(error);
    alert("Impossible de contacter le serveur.");
  }
};

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded shadow">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Créer un compte
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm mb-1">
                Email
              </label>

              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: test@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Prénom
              </label>

              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="ex: Jean"
                required
              />
            </div>


            <div>
              <label className="block text-sm mb-1">
                Nom
              </label>

              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="ex: Dupont"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Numéro de téléphone
              </label>
              
              <input
                type="tel"
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ex: +33 6 12 34 56 78"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Mot de passe
              </label>

              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Confirmer le mot de passe
              </label>

              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Créer mon compte
            </button>

          </form>

          <p className="text-sm text-center mt-4">
            Déjà un compte ?{" "}
            <Link
              href="/account"
              className="text-blue-600 hover:underline"
            >
              Se connecter
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </>
  );
}