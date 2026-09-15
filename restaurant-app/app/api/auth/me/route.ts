import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  return NextResponse.json(user ? { loggedIn: true, user } : { loggedIn: false }, {
    status: user ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  });
}
