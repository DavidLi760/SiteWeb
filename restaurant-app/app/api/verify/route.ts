import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 400 }
    );
  }

  // Chercher le token dans la base de données
  // Si trouvé :
  // verified = true
  // token = null

  return NextResponse.redirect(new URL("/account", req.url));
}