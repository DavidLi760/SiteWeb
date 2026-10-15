import assert from "node:assert/strict";
import test from "node:test";
import { parseOrder } from "./orders";

test("order parsing rejects malformed payloads and empty carts", () => {
  for (const value of [null, [], {}, "cart", { orderType: "unknown" },
    { orderType: "takeaway", items: [] }, { orderType: "takeaway", items: {} }]) {
    assert.ok(parseOrder(value).error);
  }
});

test("order parsing ignores client prices and calculates catalog totals in cents", () => {
  const result = parseOrder({ orderType: "takeaway", items: [
    { id: 1, quantity: 2, price: 0, priceCents: 1, name: "Changed" },
    { id: 7, quantity: 3 },
  ] });
  assert.ok(result.order);
  assert.equal(result.order.totalCents, 2950);
  assert.deepEqual(result.order.items[0], { id: 1, quantity: 2, name: "Sushi saumon", priceCents: 800 });
});

test("orders reject unknown, duplicate and invalid product quantities", () => {
  const invalidItems = [
    [null], [1], [{ id: "1", quantity: 1 }], [{ id: 999, quantity: 1 }],
    [{ id: 1, quantity: 0 }], [{ id: 1, quantity: 100 }],
    [{ id: 1, quantity: 1.5 }], [{ id: 1, quantity: "2" }],
    [{ id: 1, quantity: 1 }, { id: 1, quantity: 2 }],
  ];
  for (const items of invalidItems) assert.ok(parseOrder({ orderType: "takeaway", items }).error);
  assert.ok(parseOrder({ orderType: "takeaway", items: [{ id: 1, quantity: 99 }] }).order);
});

test("delivery requires a clean address; takeaway discards delivery data", () => {
  const items = [{ id: 1, quantity: 1 }];
  for (const deliveryAddress of [undefined, {}, { street: "1 rue", postalCode: "75001", city: "Paris\nInjected" }]) {
    assert.ok(parseOrder({ orderType: "delivery", items, deliveryAddress }).error);
  }
  const result = parseOrder({
    orderType: "delivery", items,
    deliveryAddress: { street: " 1 rue ", postalCode: " 75001 ", city: " Paris " },
  });
  assert.ok(result.order);
  assert.deepEqual(result.order.deliveryAddress, { street: "1 rue", postalCode: "75001", city: "Paris", details: "" });
  const takeaway = parseOrder({ orderType: "takeaway", items, deliveryAddress: { street: "ignored" } });
  assert.ok(takeaway.order);
  assert.equal(takeaway.order.deliveryAddress, null);
});
