import { createHash, randomBytes } from "node:crypto";

export function createResetToken() {
  const token = randomBytes(32).toString("hex");
  return { token, hash: hashResetToken(token) };
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function validResetToken(token: unknown): token is string {
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
}

export function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && Buffer.byteLength(password, "utf8") <= 72;
}
