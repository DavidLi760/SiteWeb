import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import pool from "@/lib/db";
import { transporter } from "@/lib/mail";
import { menu } from "@/data/menu";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) {
    return NextResponse.json({ message: "Origine non autorisée." }, { status: 403 });
  }
  const session = await getSession();
  if (!session || typeof session === "string" || !Number.isInteger(session.id)) {
    return NextResponse.json({ message: "Connectez-vous pour envoyer votre commande." }, { status: 401 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Commande invalide." }, { status: 400 });
  }
  const products = menu.flatMap((category) => category.items);
  if (!Array.isArray(body?.items) || !body.items.length || body.items.length > products.length) {
    return NextResponse.json({ message: "Panier vide ou invalide." }, { status: 400 });
  }
  const seen = new Set<number>();
  const lines: string[] = [];
  let total = 0;
  for (const item of body.items) {
    const product = products.find((product) => product.id === item?.id);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || seen.has(product.id)) {
      return NextResponse.json({ message: "Article invalide (quantité : 1 à 99)." }, { status: 400 });
    }
    seen.add(product.id);
    const subtotal = Math.round(product.price * 100) * item.quantity;
    total += subtotal;
    lines.push(`${item.quantity} × ${product.name} — ${product.price.toFixed(2)} € / pièce — ${(subtotal / 100).toFixed(2)} €`);
  }
  const sender = process.env.SMTP_USER;
  const restaurant = process.env.ORDER_EMAIL;
  if (!sender || !restaurant) {
    return NextResponse.json({ message: "L’envoi des commandes n’est pas encore configuré." }, { status: 503 });
  }
  try {
    const result = await pool.query(
      "SELECT firstname, lastname, email, phone FROM users WHERE id = $1 AND email_verified = true",
      [session.id],
    );
    const customer = result.rows[0];
    if (!customer) {
      return NextResponse.json({ message: "Connectez-vous avec un compte vérifié." }, { status: 401 });
    }
    const reference = randomUUID();
    const info = await transporter.sendMail({
      from: sender,
      to: customer.email,
      bcc: restaurant,
      subject: `Sushi House — Commande ${reference}`,
      text: [
        `Commande ${reference}`,
        `Date : ${new Date().toISOString()}`,
        `Client : ${customer.firstname} ${customer.lastname}`,
        `Email : ${customer.email}`,
        `Téléphone : ${customer.phone}`,
        "", ...lines, "", `Total : ${(total / 100).toFixed(2)} €`,
        "", "Demande de commande uniquement : aucun paiement effectué.",
        "Le restaurant doit confirmer la prise en charge et les modalités de retrait ou de livraison.",
      ].join("\n"),
    });
    if (info.rejected?.length) {
      return NextResponse.json({ message: "Envoi incomplet. Contactez le restaurant avant de réessayer.", reference }, { status: 502 });
    }
    return NextResponse.json({ message: "Commande envoyée au restaurant et à votre adresse email. En attente de confirmation du restaurant.", reference });
  } catch {
    return NextResponse.json({ message: "Envoi non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon." }, { status: 502 });
  }
}
