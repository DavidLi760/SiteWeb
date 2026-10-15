import Link from "next/link";
import { formatMoney } from "@/lib/money";
import pool from "@/lib/db";
import type { OrderItem } from "@/lib/orders";
import type { DeliveryAddress } from "@/lib/delivery-address";
import { orderTypeLabels, type OrderType } from "@/lib/order-type";

type Order = {
  id: string;
  order_type: OrderType;
  items: OrderItem[];
  total_cents: number;
  delivery_address: DeliveryAddress | null;
  email_status: "pending" | "sent" | "incomplete";
  created_at: Date;
};

export default async function OrderHistory({ userId, firstname }: { userId: number; firstname: string }) {
  let orders: Order[] = [];
  let failed = false;
  try {
    const result = await pool.query<Order>(
      "SELECT id, order_type, items, total_cents, delivery_address, email_status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50", [userId],
    );
    orders = result.rows;
  } catch {
    failed = true;
  }
  return (
    <section aria-labelledby="orders-title" className="mx-auto w-full max-w-3xl p-6 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-lime-700">Votre compte Sushi House</p>
      <h1 id="orders-title" className="mt-3 pr-6 text-3xl font-bold text-gray-900">Mes commandes</h1>
      <p className="mt-3 text-gray-600">Bonjour {firstname}, retrouvez ici vos 50 dernières commandes.</p>
      {failed ? <p role="alert" className="mt-6 text-red-700">Historique indisponible pour le moment. Veuillez réessayer plus tard.</p> : orders.length === 0 ? (
        <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          <p>Aucune commande enregistrée pour le moment.</p>
          <p className="mt-2 text-sm">Les commandes envoyées avant la mise en place de cet historique ne sont pas disponibles ici.</p>
        </div>
      ) : <div className="my-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{orderTypeLabels[order.order_type]}</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${order.email_status === "sent" ? "bg-lime-100 text-lime-800" : "bg-amber-100 text-amber-900"}`}>
                {order.email_status === "sent" ? "Emails envoyés" : "Envoi non confirmé"}
              </span>
            </div>
            <time dateTime={order.created_at.toISOString()} className="mt-2 block text-sm text-gray-500">{order.created_at.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</time>
            <p className="mt-1 break-all text-xs text-gray-500">Référence : {order.id}</p>
            <ul className="my-4 space-y-2 text-sm">
              {order.items.map((item) => <li key={item.id} className="flex justify-between gap-3"><span>{item.quantity} × {item.name}</span><span className="shrink-0">{formatMoney(item.priceCents * item.quantity)}</span></li>)}
            </ul>
            {order.delivery_address && <p className="mb-4 break-words text-sm text-gray-600">Livraison : {order.delivery_address.street}, {order.delivery_address.postalCode} {order.delivery_address.city}{order.delivery_address.details && ` — ${order.delivery_address.details}`}</p>}
            <p className="border-t border-gray-100 pt-3 text-right font-bold">Total : {formatMoney(order.total_cents)}</p>
            {order.email_status !== "sent" && <p className="mt-3 text-sm text-amber-800">Contactez le restaurant avant de renouveler cette commande pour éviter un doublon.</p>}
          </article>
        ))}
      </div>}
      <Link href="/" className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-lime-600">Découvrir la carte</Link>
    </section>
  );
}
