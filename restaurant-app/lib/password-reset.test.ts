import assert from "node:assert/strict";
import test from "node:test";
import { createResetToken, hashResetToken, validResetToken } from "./password-reset";
import { validPassword } from "./validation";

test("reset tokens are unique and only their digest is stored", () => {
  const first = createResetToken();
  const second = createResetToken();
  assert.ok(validResetToken(first.token));
  assert.notEqual(first.token, second.token);
  assert.notEqual(first.hash, first.token);
  assert.equal(first.hash, hashResetToken(first.token));
});

test("malformed tokens are rejected", () => {
  for (const token of [null, {}, [], "", "a".repeat(63), "g".repeat(64)]) {
    assert.equal(validResetToken(token), false);
  }
});

test("password validation enforces the bcrypt byte limit including Unicode", () => {
  assert.equal(validPassword("a".repeat(8)), true);
  assert.equal(validPassword("a".repeat(72)), true);
  assert.equal(validPassword("a".repeat(73)), false);
  assert.equal(validPassword("é".repeat(36)), true);
  assert.equal(validPassword("é".repeat(37)), false);
  assert.equal(validPassword("short"), false);
  assert.equal(validPassword(null), false);
});
