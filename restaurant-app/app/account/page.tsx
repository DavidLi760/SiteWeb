"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
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
        router.push("/")
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: test@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Se connecter
          </button>
        </form>

        {/* Optional register */}
        <p className="text-sm text-center mt-4">
          Pas de compte ?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
    </>
  );
}