import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const token = crypto.randomUUID();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Cet email existe déjà",
        },
        {
          status: 400,
        }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken: token,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre compte",
      html: `
        <h2>Bienvenue !</h2>
        <p>Cliquez sur le lien ci-dessous pour confirmer votre adresse :</p>

        <a href="http://localhost:3000/api/verify?token=${token}">
          Confirmer mon compte
        </a>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email envoyé",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}