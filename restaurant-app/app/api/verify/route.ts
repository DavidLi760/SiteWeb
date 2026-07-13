import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {

  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 400 }
    );
  }


  const user = await prisma.user.findUnique({
    where: {
      verificationToken: token,
    },
  });


  if (!user) {
    return NextResponse.json(
      { message: "Token invalide ou expiré" },
      { status: 400 }
    );
  }


  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verified: true,
      verificationToken: null,
    },
  });


  return NextResponse.redirect(
    new URL("/account", req.url)
  );
}