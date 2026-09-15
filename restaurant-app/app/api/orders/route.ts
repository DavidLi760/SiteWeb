import { parseDeliveryAddress } from "@/lib/delivery-address";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import pool from "@/lib/db";
import { transporter } from "@/lib/mail";
import { isOrderType, orderTypeLabels, type OrderType } from "@/lib/order-type";
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
  if (!isOrderType(body?.orderType)) {
    return NextResponse.json({ message: "Choisissez Emporter ou Livraison." }, { status: 400 });
  }
  const orderType: OrderType = body.orderType;
  const deliveryAddress = orderType === "delivery" ? parseDeliveryAddress(body.deliveryAddress) : null;
  if (orderType === "delivery" && !deliveryAddress) {
    return NextResponse.json({ message: "Veuillez renseigner une adresse de livraison complète et valide." }, { status: 400 });
  }
  const products = menu.flatMap((category) => category.items);
  if (!Array.isArray(body?.items) || !body.items.length || body.items.length > products.length) {
    return NextResponse.json({ message: "Panier vide ou invalide." }, { status: 400 });
  }
  const seen = new Set<number>();
  const lines: string[] = [];
  const orderItems: { id: number; name: string; quantity: number; priceCents: number }[] = [];
  let total = 0;
  for (const item of body.items) {
    const product = products.find((product) => product.id === item?.id);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || seen.has(product.id)) {
      return NextResponse.json({ message: "Article invalide (quantité : 1 à 99)." }, { status: 400 });
    }
    seen.add(product.id);
    const subtotal = Math.round(product.price * 100) * item.quantity;
    total += subtotal;
    orderItems.push({ id: product.id, name: product.name, quantity: item.quantity, priceCents: Math.round(product.price * 100) });
    lines.push(`${item.quantity} × ${product.name} — ${product.price.toFixed(2)} € / pièce — ${(subtotal / 100).toFixed(2)} €`);
  }
  const sender = process.env.SMTP_USER;
  const restaurant = process.env.ORDER_EMAIL?.trim();
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
    await pool.query(
      "INSERT INTO orders (id, user_id, order_type, items, total_cents, delivery_address) VALUES ($1, $2, $3, $4, $5, $6)",
      [reference, session.id, orderType, JSON.stringify(orderItems), total, deliveryAddress ? JSON.stringify(deliveryAddress) : null],
    );
    const text = [
        `Commande ${reference}`,
        `Mode de commande : ${orderTypeLabels[orderType]}`,
        ...(deliveryAddress ? [
          "Adresse de livraison :",
          deliveryAddress.street,
          `${deliveryAddress.postalCode} ${deliveryAddress.city}`,
          ...(deliveryAddress.details ? [`Complément : ${deliveryAddress.details}`] : []),
        ] : []),
        `Date : ${new Date().toISOString()}`,
        `Client : ${customer.firstname} ${customer.lastname}`,
        `Email : ${customer.email}`,
        `Téléphone : ${customer.phone}`,
        "", ...lines, "", `Total : ${(total / 100).toFixed(2)} €`,
        "", "Aucun paiement effectué en ligne.",
        "Votre commande a été transmise au restaurant. Aucune confirmation supplémentaire n’est nécessaire.",
      ].join("\n");
    const recipients = [
      { role: "restaurant", to: restaurant, subject: `Sushi House — Nouvelle commande ${reference}` },
      { role: "client", to: customer.email, subject: `Sushi House — Votre commande ${reference}` },
    ];
    const results = await Promise.all(recipients.map(async (recipient) => {
      try {
        const info = await transporter.sendMail({
          from: sender,
          to: recipient.to,
          subject: recipient.subject,
          text,
        });
        const accepted = info.accepted?.some((address) =>
          (typeof address === "string" ? address : address.address)?.toLowerCase() === recipient.to.toLowerCase()
        ) && !info.rejected?.length;
        console.info("ORDER_EMAIL", {
          reference, recipient: recipient.role,
          status: accepted ? "smtp_accepted" : "smtp_rejected",
          messageId: info.messageId,
        });
        return Boolean(accepted);
      } catch (error) {
        const details = error as { code?: string; responseCode?: number };
        console.error("ORDER_EMAIL", {
          reference, recipient: recipient.role, status: "failed",
          code: details?.code, responseCode: details?.responseCode,
        });
        return false;
      }
    }));
    await pool.query("UPDATE orders SET email_status = $1 WHERE id = $2", [results.every(Boolean) ? "sent" : "incomplete", reference]);
    if (results.some((accepted) => !accepted)) {
      return NextResponse.json({ message: "Envoi incomplet ou non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon.", reference }, { status: 502 });
    }
    return NextResponse.json({ message: "Commande envoyée au restaurant et à votre adresse email. Aucune confirmation supplémentaire n’est nécessaire.", reference });
  } catch {
    return NextResponse.json({ message: "Envoi non confirmé. Contactez le restaurant avant de réessayer pour éviter un doublon." }, { status: 502 });
  }
}
