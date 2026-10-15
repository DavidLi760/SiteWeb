import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json().catch(() => null)) ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password ||
        email.length > 255 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json({ success: false, message: "Email et mot de passe requis" }, { status: 400 });
    }
    const result = await pool.query(
      `SELECT id, email, firstname, password_hash, email_verified,
        COALESCE((to_jsonb(users)->>'password_version')::integer, 0) AS password_version
       FROM users WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return NextResponse.json({ success: false, message: "Email ou mot de passe incorrect" }, { status: 401 });
    }
    if (!user.email_verified) {
      return NextResponse.json({ success: false, message: "Veuillez vérifier votre email avant de vous connecter" }, { status: 403 });
    }

    const session = { id: user.id, firstname: user.firstname, email: user.email };
    const token = jwt.sign(
      { ...session, passwordVersion: user.password_version },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    const response = NextResponse.json({ success: true, message: "Connexion réussie", user: session });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
