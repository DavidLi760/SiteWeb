import assert from "node:assert/strict";
import test from "node:test";
import { parseCart } from "./cart";

test("corrupted storage and non-array values produce an empty cart", () => {
  for (const value of [null, "{", "null", "{}", "42"]) {
    assert.deepEqual(parseCart(value), []);
  }
});

test("cart uses catalog data and rejects unknown products and invalid quantities", () => {
  const cart = parseCart(JSON.stringify([
    { id: 1, quantity: 2, price: 0, name: "Changed" },
    null, { id: 999, quantity: 1 }, { id: 2, quantity: -1 },
    { id: 3, quantity: 1.5 }, { id: 4, quantity: "2" },
  ]));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].name, "Sushi saumon");
  assert.equal(cart[0].price, 8);
  assert.equal(cart[0].quantity, 2);
});

test("duplicate products merge and quantities respect the order API limit", () => {
  const cart = parseCart('[{"id":1,"quantity":60},{"id":1,"quantity":60}]');
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 99);
});
