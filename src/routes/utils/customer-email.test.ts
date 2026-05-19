import test from "node:test";
import assert from "node:assert/strict";

import { normalizeOptionalCustomerEmail } from "./customer-email";

test("normalizeOptionalCustomerEmail accepts valid optional emails", () => {
  assert.equal(normalizeOptionalCustomerEmail(undefined), undefined);
  assert.equal(normalizeOptionalCustomerEmail(null), undefined);
  assert.equal(normalizeOptionalCustomerEmail("  buyer@example.com  "), "buyer@example.com");
});

test("normalizeOptionalCustomerEmail rejects invalid values", () => {
  assert.equal(normalizeOptionalCustomerEmail("not-an-email"), null);
  assert.equal(normalizeOptionalCustomerEmail("buyer@example"), null);
  assert.equal(normalizeOptionalCustomerEmail(123), null);
});
