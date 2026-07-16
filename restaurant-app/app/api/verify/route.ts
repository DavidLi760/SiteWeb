import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    // Cherche l'utilisateur avec le token
    const result = await pool.query(
      `
      SELECT id FROM users
      WHERE verification_token = $1
      `,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const userId = result.rows[0].id;

    // Active le compte
    await pool.query(
      `
      UPDATE users
      SET email_verified = true,
          verification_token = NULL
      WHERE id = $1
      `,
      [userId]
    );

    return NextResponse.redirect(
      new URL("/login?verified=true", req.url)
    );

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}