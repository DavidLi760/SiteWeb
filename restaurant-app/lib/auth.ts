import { cookies } from "next/headers";
import pool from "./db";
import jwt from "jsonwebtoken";

export type Session = { id: number; firstname: string; email: string };

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      { algorithms: ["HS256"] }
    );
    if (typeof payload === "string" || !Number.isInteger(payload.id) ||
        typeof payload.firstname !== "string" || typeof payload.email !== "string") return null;
    const result = await pool.query("SELECT COALESCE((to_jsonb(users)->>'password_version')::integer, 0) AS password_version FROM users WHERE id = $1", [payload.id]);
    if (!result.rows[0] || result.rows[0].password_version !== (payload.passwordVersion ?? 0)) return null;
    return { id: payload.id, firstname: payload.firstname, email: payload.email } as Session;
  } catch {
    return null;
  }
}
