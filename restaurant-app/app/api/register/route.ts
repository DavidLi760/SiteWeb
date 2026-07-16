import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "@/lib/db";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      phone,
      password,
    } = body;


    if (!email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Tous les champs sont obligatoires."
        },
        {
          status: 400
        }
      );
    }


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
        $5
      )
      RETURNING id, email, phone
      `,
      [
        email,
        phone,
        passwordHash,
        false,
        verificationToken
      ]
    );


    // URL de confirmation
    const verificationUrl =
      `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}`;


    /*
      Ici on ajoutera l'envoi du mail :

      Exemple :

      await transporter.sendMail({
        from: "no-reply@tonsite.com",
        to: email,
        subject: "Confirmation de votre compte",
        html: `
          <h1>Bienvenue</h1>
          <p>Cliquez sur le lien pour confirmer votre email :</p>
          <a href="${verificationUrl}">
            Confirmer mon email
          </a>
        `
      });
    */


    console.log(
      "Lien de confirmation :",
      verificationUrl
    );


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

    console.error(
      "REGISTER ERROR:",
      error
    );


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