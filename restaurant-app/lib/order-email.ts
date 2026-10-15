import { transporter } from "./mail";
import { orderTypeLabels } from "./order-type";
import type { PreparedOrder } from "./orders";

export type OrderCustomer = { firstname: string; lastname: string; email: string; phone: string };

export function buildOrderEmail(reference: string, order: PreparedOrder, customer: OrderCustomer, date = new Date()) {
  const { deliveryAddress, items } = order;
  const lines = items.map(({ name, quantity, priceCents }) =>
    `${quantity} × ${name} — ${(priceCents / 100).toFixed(2)} € / pièce — ${(priceCents * quantity / 100).toFixed(2)} €`
  );
  return [
    `Commande ${reference}`,
    `Mode de commande : ${orderTypeLabels[order.orderType]}`,
    ...(deliveryAddress ? [
      "Adresse de livraison :",
      deliveryAddress.street,
      `${deliveryAddress.postalCode} ${deliveryAddress.city}`,
      ...(deliveryAddress.details ? [`Complément : ${deliveryAddress.details}`] : []),
    ] : []),
    `Date : ${date.toISOString()}`,
    `Client : ${customer.firstname} ${customer.lastname}`,
    `Email : ${customer.email}`,
    `Téléphone : ${customer.phone}`,
    "", ...lines, "", `Total : ${(order.totalCents / 100).toFixed(2)} €`,
    "", "Aucun paiement effectué en ligne.",
    "Votre commande a été transmise au restaurant. Aucune confirmation supplémentaire n’est nécessaire.",
  ].join("\n");
}

export async function sendOrderEmails({ reference, sender, restaurant, customerEmail, text }: {
  reference: string;
  sender: string;
  restaurant: string;
  customerEmail: string;
  text: string;
}): Promise<boolean> {
  const recipients = [
    { role: "restaurant", to: restaurant, subject: `Sushi House — Nouvelle commande ${reference}` },
    { role: "client", to: customerEmail, subject: `Sushi House — Votre commande ${reference}` },
  ];
  const results = await Promise.all(recipients.map(async (recipient) => {
    try {
      const info = await transporter.sendMail({ from: sender, to: recipient.to, subject: recipient.subject, text });
      const accepted = info.accepted?.some((address) =>
        (typeof address === "string" ? address : address.address)?.toLowerCase() === recipient.to.toLowerCase()
      ) && !info.rejected?.length;
      console.info("ORDER_EMAIL", {
        reference, recipient: recipient.role,
        status: accepted ? "smtp_accepted" : "smtp_rejected", messageId: info.messageId,
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
  return results.every(Boolean);
}
