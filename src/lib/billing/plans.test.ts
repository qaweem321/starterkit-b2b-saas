import assert from "node:assert/strict";
import { test } from "node:test";
import { planFromStatus } from "./plans";

test("active and trialing subscriptions are Pro", () => {
  assert.equal(planFromStatus("active"), "pro");
  assert.equal(planFromStatus("trialing"), "pro");
});

test("everything else is Free", () => {
  for (const status of ["canceled", "past_due", "incomplete", "unpaid", "", null, undefined]) {
    assert.equal(planFromStatus(status), "free", String(status));
  }
});
