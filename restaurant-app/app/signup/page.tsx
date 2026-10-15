"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

export default function SignupPage() {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") ?? "");
    const firstname = String(fields.get("firstname") ?? "");
    const lastname = String(fields.get("lastname") ?? "");
    const phone = String(fields.get("phone") ?? "");
    const password = String(fields.get("password") ?? "");
    const confirmPassword = String(fields.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    busy.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstname, lastname, phone, password }),
      });
      const data = await response.json();
      alert(data.success
        ? "Compte créé ! Vérifie ton email pour confirmer ton adresse."
        : data.message || "Erreur lors de la création du compte.");
    } catch (error) {
      console.error(error);
      alert("Impossible de contacter le serveur.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <AuthCard
      icon="fa-user-plus"
      title="Créer un compte"
      description="Créez votre compte pour préparer votre prochaine commande."
    >
      <form aria-busy={pending} onSubmit={handleSubmit} className="mt-7 space-y-5">
        <FormField id="email" label="Email" type="email" placeholder="vous@exemple.fr" required disabled={pending} />
        <FormField id="firstname" label="Prénom" type="text" placeholder="ex: Jean" required disabled={pending} />
        <FormField id="lastname" label="Nom" type="text" placeholder="ex: Dupont" required disabled={pending} />
        <FormField id="phone" label="Numéro de téléphone" type="tel" placeholder="ex: +33 6 12 34 56 78" required disabled={pending} />
        <FormField id="password" label="Mot de passe" type="password" placeholder="••••••••" required disabled={pending} />
        <FormField id="confirmPassword" label="Confirmer le mot de passe" type="password" placeholder="••••••••" required disabled={pending} />
        <SubmitButton disabled={pending}>{pending ? "Création…" : "Créer mon compte"}</SubmitButton>
      </form>
      <p className="mt-6 text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Link replace href="/account" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}
