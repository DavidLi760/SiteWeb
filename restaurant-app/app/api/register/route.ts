import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "@/lib/db";
import { transporter } from "@/lib/mail";


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });

    const {
      email,
      firstname,
      lastname,
      phone,
      password,
    } = body;


    if (![email, firstname, lastname, phone, password].every((value) => typeof value === "string" && value.trim().length > 0) ||
        email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        firstname.length > 50 || lastname.length > 50 || phone.length > 30 ||
        password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        {
          success: false,
          message: "Champs invalides. Le mot de passe doit contenir au moins 8 caractères et au maximum 72 octets."
        },
        {
          status: 400
        }
      );
    }


    const baseUrl = process.env.NEXT_PUBLIC_URL;
    if (!baseUrl || !process.env.SMTP_USER) {
      return NextResponse.json({ success: false, message: "Inscription indisponible : email non configuré." }, { status: 503 });
    }
    const verificationBase = new URL("/api/verify", baseUrl);

    // Vérifier si l'utilisateur existe déjà

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );


    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cet email existe déjà."
        },
        {
          status: 409
        }
      );
    }


    // Hash du mot de passe

    const passwordHash = await bcrypt.hash(
      password,
      12
    );


    // Création du token de confirmation email

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");


    // Insérer l'utilisateur

    const result = await pool.query(
      `
      INSERT INTO users
      (
        email,
        firstname,
        lastname,
        phone,
        password_hash,
        email_verified,
        verification_token
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING id, email, phone
      `,
      [
        email,
        firstname,
        lastname,
        phone,
        passwordHash,
        false,
        verificationToken
      ]
    );


    // URL de confirmation
    const verificationUrl =
      `${verificationBase.href}?token=${verificationToken}`;

await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Confirmation de votre compte",
  html: `
    <h1>Bienvenue</h1>
    <p>Cliquez ici pour confirmer votre email :</p>
    <a href="${verificationUrl}">
      Confirmer mon email
    </a>
  `,
});


    return NextResponse.json(
      {
        success: true,
        message: "Compte créé. Vérifiez votre email.",
        user: result.rows[0]
      },
      {
        status: 201
      }
    );


  } catch (error) {

    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return NextResponse.json({ success: false, message: "Cet email existe déjà." }, { status: 409 });
    }
    console.error("REGISTER ERROR:", error);


    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur."
      },
      {
        status: 500
      }
    );
  }
}