import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email et mot de passe obligatoires."
        },
        {
          status: 400
        }
      );
    }

    // Chercher l'utilisateur
    const result = await pool.query(
      `
      SELECT 
        id,
        email,
        phone,
        password_hash,
        email_verified
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect."
        },
        {
          status: 401
        }
      );
    }

    const user = result.rows[0];

    // Vérifier email
    if (!user.email_verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Veuillez confirmer votre email avant de vous connecter."
        },
        {
          status: 403
        }
      );
    }

    // Vérifier mot de passe
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect."
        },
        {
          status: 401
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Connexion réussie.",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone
        }
      },
      {
        status: 200
      }
    );

  } catch (error) {
    console.error("LOGIN ERROR:", error);

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