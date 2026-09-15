import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { hashResetToken, validPassword, validResetToken } from "@/lib/password-reset";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!validResetToken(body?.token) || !validPassword(body?.password)) {
    return NextResponse.json({ message: "Lien invalide ou mot de passe non conforme (8 caractères minimum, 72 octets maximum)." }, { status: 400 });
  }
  try {
    const hash = hashResetToken(body.token);
    const existing = await pool.query("SELECT id FROM users WHERE reset_token_hash = $1 AND reset_token_expires_at > NOW()", [hash]);
    if (!existing.rowCount) {
      return NextResponse.json({ message: "Ce lien est invalide ou expiré. Demandez un nouveau lien." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(body.password, 12);
    // Recheck expiry and consume the token in the same write to prevent reuse.
    const result = await pool.query(
      `UPDATE users SET password_hash = $1, reset_token_hash = NULL,
       reset_token_expires_at = NULL, password_version = password_version + 1, updated_at = NOW()
       WHERE reset_token_hash = $2 AND reset_token_expires_at > NOW() RETURNING id`,
      [passwordHash, hash],
    );
    if (!result.rowCount) {
      return NextResponse.json({ message: "Ce lien est invalide ou expiré. Demandez un nouveau lien." }, { status: 400 });
    }
    const response = NextResponse.json({ message: "Mot de passe modifié. Vous pouvez maintenant vous connecter." });
    response.cookies.set("token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json({ message: "Impossible de modifier le mot de passe pour le moment." }, { status: 503 });
  }
}
