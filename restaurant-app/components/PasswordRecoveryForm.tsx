"use client";

import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import { useRef, useState } from "react";

export default function PasswordRecoveryForm({ token }: { token?: string }) {
  const resetting = token !== undefined;
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);
  const inputStyle = "mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-lime-600 focus:outline-2 focus:outline-lime-600";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fields = new FormData(event.currentTarget);
    const password = String(fields.get("password") ?? "");
    if (resetting && (password !== fields.get("confirmPassword") || new TextEncoder().encode(password).length > 72)) {
      setMessage("Les mots de passe doivent être identiques et ne pas dépasser 72 octets.");
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
    <AuthModal>
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <span aria-hidden="true" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
          <i className="fa-solid fa-lock" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-lime-700">Votre compte Sushi House</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{resetting ? "Nouveau mot de passe" : "Mot de passe oublié ?"}</h1>
        <p className="mt-4 leading-7 text-gray-600">
          {resetting ? "Choisissez un mot de passe d’au moins 8 caractères (72 octets maximum)." : "Indiquez l’adresse email de votre compte. Nous vous enverrons un lien pour choisir un nouveau mot de passe, valable 30 minutes."}
        </p>
        {resetting && !token ? (
          <p role="alert" className="mt-6 text-red-700">Le lien est incomplet. Demandez un nouveau lien ci-dessous.</p>
        ) : !success && (
          <form onSubmit={submit} className="mt-7 space-y-5" aria-busy={pending}>
            {resetting ? (
              <>
                <div>
                  <label htmlFor="new-password" className="text-sm font-medium">Nouveau mot de passe</label>
                  <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={pending} className={inputStyle} />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirmer le mot de passe</label>
                  <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={pending} className={inputStyle} />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="recovery-email" className="text-sm font-medium">Adresse email</label>
                <input id="recovery-email" name="email" type="email" autoComplete="email" maxLength={255} required disabled={pending} className={inputStyle} placeholder="vous@exemple.fr" />
              </div>
            )}
            <button disabled={pending} className="min-h-12 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600 disabled:opacity-50">
              {pending ? "En cours…" : resetting ? "Enregistrer le mot de passe" : "Recevoir le lien"}
            </button>
          </form>
        )}
        <p role="status" aria-live="polite" className={`mt-5 text-sm leading-6 ${success ? "text-lime-800" : "text-red-700"}`}>{message}</p>
        <div className="mt-6 flex flex-col gap-4 text-sm">
          <Link replace href="/account" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">Retour à la connexion</Link>
          {resetting && !success && <Link replace href="/forgot-password" className="rounded text-gray-600 underline underline-offset-4 hover:text-lime-700 focus-visible:outline-2 focus-visible:outline-lime-600">Demander un nouveau lien</Link>}
          {!resetting && success && <button onClick={() => { setSuccess(false); setMessage(""); }} className="text-left text-gray-600 underline underline-offset-4 hover:text-lime-700">Réessayer ou utiliser une autre adresse</button>}
        </div>
      </div>
    </AuthModal>
  );
}
