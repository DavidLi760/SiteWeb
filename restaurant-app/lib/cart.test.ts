import assert from "node:assert/strict";
import test from "node:test";
import { addCartItem, parseCart, setCartQuantity } from "./cart";
import { products } from "../data/menu";

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

test("adding a product merges its quantity without mutating the cart", () => {
  const original = [{ ...products[0], quantity: 60 }];
  const updated = addCartItem(original, products[0], 60);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].quantity, 99);
  assert.equal(original[0].quantity, 60);
  const withAnother = addCartItem(updated, products[1], 2);
  assert.equal(withAnother.length, 2);
  assert.equal(withAnother[1].quantity, 2);
});

test("quantity changes respect limits and preserve unrelated products", () => {
  const cart = [{ ...products[0], quantity: 2 }, { ...products[1], quantity: 3 }];
  const minimum = setCartQuantity(cart, products[0].id, 0);
  const maximum = setCartQuantity(cart, products[0].id, 100);
  assert.equal(minimum[0].quantity, 1);
  assert.equal(maximum[0].quantity, 99);
  assert.equal(maximum[1], cart[1]);
  assert.equal(cart[0].quantity, 2);
  assert.equal(addCartItem([], products[0], 100)[0].quantity, 99);
});
