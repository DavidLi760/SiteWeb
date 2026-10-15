import assert from "node:assert/strict";
import test from "node:test";
import { transporter } from "./mail";
import { buildOrderEmail, sendOrderEmails } from "./order-email";
import type { PreparedOrder } from "./orders";

const order: PreparedOrder = {
  orderType: "delivery",
  deliveryAddress: { street: "1 rue Exemple", postalCode: "75001", city: "Paris", details: "Étage 2" },
  items: [{ id: 7, name: "Maki saumon", quantity: 3, priceCents: 450 }],
  totalCents: 1350,
};
const customer = { firstname: "Jean", lastname: "Dupont", email: "client@example.test", phone: "0102030405" };
const delivery = {
  reference: "test-reference", sender: "sender@example.test",
  restaurant: "restaurant@example.test", customerEmail: customer.email, text: "Commande test",
};

test("order email contains the archived prices, total and delivery details", () => {
  const text = buildOrderEmail("reference", order, customer, new Date("2026-01-01T12:00:00Z"));
  assert.ok(text.includes("3 × Maki saumon — 4.50 € / pièce — 13.50 €"));
  assert.ok(text.includes("Total : 13.50 €"));
  assert.ok(text.includes("75001 Paris"));
  assert.ok(text.includes("Complément : Étage 2"));
  const takeaway = buildOrderEmail("reference", { ...order, orderType: "takeaway", deliveryAddress: null }, customer);
  assert.ok(!takeaway.includes("Adresse de livraison"));
});

test("email success requires SMTP acceptance for both recipients", async (t) => {
  const recipients: string[] = [];
  t.mock.method(console, "info", () => {});
  t.mock.method(transporter, "sendMail", async ({ to }: { to: string }) => {
    recipients.push(to);
    return { accepted: [{ address: to.toUpperCase() }], rejected: [] };
  });
  assert.equal(await sendOrderEmails(delivery), true);
  assert.deepEqual(recipients, [delivery.restaurant, customer.email]);
});

test("SMTP rejection or failure never reports a complete order email delivery", async (t) => {
  t.mock.method(console, "info", () => {});
  t.mock.method(console, "error", () => {});
  for (const failure of ["rejected", "unexpected-recipient", "exception"]) {
    const recipients: string[] = [];
    const mocked = t.mock.method(transporter, "sendMail", async ({ to }: { to: string }) => {
      recipients.push(to);
      if (to === customer.email) return { accepted: [to], rejected: [] };
      if (failure === "exception") throw new Error("SMTP unavailable");
      return failure === "rejected"
        ? { accepted: [to], rejected: [to] }
        : { accepted: ["someone@example.test"], rejected: [] };
    });
    assert.equal(await sendOrderEmails(delivery), false);
    assert.equal(recipients.length, 2);
    mocked.mock.restore();
  }
});
