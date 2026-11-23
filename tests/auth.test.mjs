import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, createToken, verifyToken } from "../server/auth.ts";

test("Password Hashing and Salt Verification", () => {
  const rawPassword = "cantinhodoce2027";
  const { hash, salt } = hashPassword(rawPassword);

  assert.ok(hash && hash.length === 128, "Hash should be 64 bytes hex (128 chars)");
  assert.ok(salt && salt.length === 32, "Salt should be 16 bytes hex (32 chars)");

  const isValid = verifyPassword(rawPassword, hash, salt);
  assert.strictEqual(isValid, true, "Valid password should verify successfully");

  const isInvalid = verifyPassword("wrongpassword", hash, salt);
  assert.strictEqual(isInvalid, false, "Wrong password should fail verification");
});

test("Signed JWT / Session Tokens", () => {
  const token = createToken(1, "janaina", "admin");
  assert.ok(token && token.includes("."), "Token should be in payload.signature format");

  const verified = verifyToken(token);
  assert.ok(verified, "Token should be valid and verified");
  assert.strictEqual(verified.userId, 1);
  assert.strictEqual(verified.username, "janaina");
  assert.strictEqual(verified.role, "admin");

  // Tampered token test
  const tamperedToken = token + "tampered";
  const failed = verifyToken(tamperedToken);
  assert.strictEqual(failed, null, "Tampered token should be rejected");
});
