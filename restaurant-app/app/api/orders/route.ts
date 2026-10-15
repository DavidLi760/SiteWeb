import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth";
import pool from "@/lib/db";
import { parseOrder } from "@/lib/orders";
import { buildOrderEmail, sendOrderEmails, type OrderCustomer } from "@/lib/order-email";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) {
    return NextResponse.json({ message: "Origine non autorisée." }, { status: 403 });
  }
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Connectez-vous pour envoyer votre commande." }, { status: 401 });
  }
  const parsed = parseOrder(await req.json().catch(() => null));
  if (!parsed.order) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }
  const order = parsed.order;
  const sender = process.env.SMTP_USER;
  const restaurant = process.env.ORDER_EMAIL?.trim();
  if (!sender || !restaurant) {
    return NextResponse.json({ message: "L’envoi des commandes n’est pas encore configuré." }, { status: 503 });
  }

  try {
    const result = await pool.query<OrderCustomer>(
      "SELECT firstname, lastname, email, phone FROM users WHERE id = $1 AND email_verified = true",
      [session.id],
    );
    const customer = result.rows[0];
    if (!customer) {
      return NextResponse.json({ message: "Connectez-vous avec un compte vérifié." }, { status: 401 });
    }
    const reference = randomUUID();
    await pool.query(
      "INSERT INTO orders (id, user_id, order_type, items, total_cents, delivery_address) VALUES ($1, $2, $3, $4, $5, $6)",
      [reference, session.id, order.orderType, JSON.stringify(order.items), order.totalCents,
        order.deliveryAddress ? JSON.stringify(order.deliveryAddress) : null],
    );
    const sent = await sendOrderEmails({
      reference, sender, restaurant, customerEmail: customer.email,
      text: buildOrderEmail(reference, order, customer),
    });
    await pool.query("UPDATE orders SET email_status = $1 WHERE id = $2", [sent ? "sent" : "incomplete", reference]);
    if (!sent) {
      return NextResponse.json({ message: "Envoi incomplet ou non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon.", reference }, { status: 502 });
    }
    return NextResponse.json({ message: "Commande envoyée au restaurant et à votre adresse email. Aucune confirmation supplémentaire n’est nécessaire.", reference });
  } catch {
    return NextResponse.json({ message: "Envoi non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon." }, { status: 502 });
  }
}
