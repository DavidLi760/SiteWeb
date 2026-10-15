export function validEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && new TextEncoder().encode(password).length <= 72;
}
