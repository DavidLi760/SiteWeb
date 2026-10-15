import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { transporter } from "@/lib/mail";
import { createResetToken } from "@/lib/password-reset";
import { validEmail } from "@/lib/validation";

const message = "Si un compte correspond à cette adresse, un lien vous sera envoyé. Vérifiez aussi vos courriers indésirables. Vous pouvez demander un nouveau lien dans une minute.";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!validEmail(email)) {
    return NextResponse.json({ message: "Saisissez une adresse email valide." }, { status: 400 });
  }
  if (!process.env.NEXT_PUBLIC_URL || !process.env.SMTP_USER) {
    return NextResponse.json({ message: "Service temporairement indisponible." }, { status: 503 });
  }
  try {
    const { token, hash } = createResetToken();
    const url = new URL("/reset-password", process.env.NEXT_PUBLIC_URL);
    url.searchParams.set("token", token);
    // Atomic per-account cooldown, shared across all server instances.
    const result = await pool.query(
      `UPDATE users SET reset_token_hash = $1,
        reset_token_expires_at = NOW() + INTERVAL '30 minutes', reset_requested_at = NOW()
       WHERE email = $2 AND (reset_requested_at IS NULL OR reset_requested_at < NOW() - INTERVAL '1 minute')
       RETURNING id, email`, [hash, email],
    );
    if (result.rows[0]) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: result.rows[0].email,
          subject: "Sushi House — Réinitialiser votre mot de passe",
          text: `Pour choisir un nouveau mot de passe, ouvrez ce lien :\n\n${url.href}\n\nCe lien est valable 30 minutes et ne peut être utilisé qu’une fois.\nSi vous n’avez pas demandé ce changement, ignorez cet email.`,
        });
      } catch {
        // Keep the public response identical for existing and unknown accounts.
        console.error("Password reset email could not be sent.");
      }
    }
    return NextResponse.json({ message }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Service temporairement indisponible. Réessayez plus tard." }, { status: 503 });
  }
}
