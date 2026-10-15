"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") ?? "");
    const password = String(fields.get("password") ?? "");

    busy.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

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
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <AuthCard
      icon="fa-user"
      title="Connexion"
      description="Connectez-vous pour retrouver votre compte et envoyer votre commande."
      showAccountLabel={false}
    >
      <form aria-busy={pending} onSubmit={handleSubmit} className="mt-7 space-y-5">
        <FormField id="email" label="Email" type="email" placeholder="vous@exemple.fr" required disabled={pending} />
        <FormField id="password" label="Mot de passe" type="password" placeholder="••••••••" required disabled={pending} />
        <div className="text-right">
          <Link replace href="/forgot-password" className="text-sm rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">
            Mot de passe oublié ?
          </Link>
        </div>
        <SubmitButton disabled={pending}>{pending ? "Connexion…" : "Se connecter"}</SubmitButton>
      </form>
      <p className="mt-6 text-sm text-gray-600">
        Pas de compte ?{" "}
        <Link replace href="/signup" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">
          Créer un compte
        </Link>
      </p>
    </AuthCard>
  );
}
