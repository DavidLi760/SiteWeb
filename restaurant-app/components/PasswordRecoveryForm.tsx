"use client";

import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { useRef, useState } from "react";
import { validPassword } from "@/lib/validation";

export default function PasswordRecoveryForm({ token }: { token?: string }) {
  const resetting = token !== undefined;
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fields = new FormData(event.currentTarget);
    const password = String(fields.get("password") ?? "");
    if (resetting && (password !== fields.get("confirmPassword") || !validPassword(password))) {
      setMessage("Les mots de passe doivent être identiques, contenir au moins 8 caractères et ne pas dépasser 72 octets.");
      return;
    }
    busy.current = true;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(resetting ? "/api/reset-password" : "/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetting ? { token, password } : { email: fields.get("email") }),
      });
      const data = await response.json();
      setMessage(data.message);
      setSuccess(response.ok);
    } catch {
      setMessage("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <AuthCard
      icon="fa-lock"
      title={resetting ? "Nouveau mot de passe" : "Mot de passe oublié ?"}
      description={resetting ? "Choisissez un mot de passe d’au moins 8 caractères (72 octets maximum)." : "Indiquez l’adresse email de votre compte. Nous vous enverrons un lien pour choisir un nouveau mot de passe, valable 30 minutes."}
    >
      {resetting && !token ? (
        <p role="alert" className="mt-6 text-red-700">Le lien est incomplet. Demandez un nouveau lien ci-dessous.</p>
      ) : !success && (
        <form onSubmit={submit} className="mt-7 space-y-5" aria-busy={pending}>
          {resetting ? (
            <>
              <FormField id="new-password" label="Nouveau mot de passe" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={pending} />
              <FormField id="confirm-password" label="Confirmer le mot de passe" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={pending} />
            </>
          ) : (
            <FormField id="recovery-email" label="Adresse email" name="email" type="email" autoComplete="email" maxLength={255} required disabled={pending} placeholder="vous@exemple.fr" />
          )}
          <SubmitButton disabled={pending}>
            {pending ? "En cours…" : resetting ? "Enregistrer le mot de passe" : "Recevoir le lien"}
          </SubmitButton>
        </form>
      )}
      <p role="status" aria-live="polite" className={`mt-5 text-sm leading-6 ${success ? "text-lime-800" : "text-red-700"}`}>{message}</p>
      <div className="mt-6 flex flex-col gap-4 text-sm">
        <Link replace href="/account" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">Retour à la connexion</Link>
        {resetting && !success && <Link replace href="/forgot-password" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">Demander un nouveau lien</Link>}
        {!resetting && success && <button onClick={() => { setSuccess(false); setMessage(""); }} className="text-left text-gray-600 underline underline-offset-4 hover:text-lime-700">Réessayer ou utiliser une autre adresse</button>}
      </div>
    </AuthCard>
  );
}
