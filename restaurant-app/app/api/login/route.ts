import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect",
        },
        {
          status: 401,
        }
      );
    }


    if (!user.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Veuillez confirmer votre email avant de vous connecter",
        },
        {
          status: 403,
        }
      );
    }


    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect",
        },
        {
          status: 401,
        }
      );
    }


    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
    });


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}