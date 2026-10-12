import assert from "node:assert/strict";
import { test } from "node:test";
import {
  hasPaymentProblem,
  keepsCharging,
  memberLimitLabel,
  paymentProblemTitle,
  periodNote,
  planFromStatus,
} from "./plans";

test("active and trialing subscriptions are Pro", () => {
  assert.equal(planFromStatus("active"), "pro");
  assert.equal(planFromStatus("trialing"), "pro");
});

test("everything else is Free", () => {
  for (const status of [
    "canceled",
    "past_due",
    "incomplete",
    "unpaid",
    "paused",
    "",
    null,
    undefined,
  ]) {
    assert.equal(planFromStatus(status), "free", String(status));
  }
});

test("describes member limits", () => {
  assert.equal(memberLimitLabel(3), "Up to 3 members");
  assert.equal(memberLimitLabel(Infinity), "Unlimited members");
});

test("failed payments are detected", () => {
  for (const status of ["past_due", "unpaid", "incomplete", "paused"]) {
    assert.equal(hasPaymentProblem(status), true, status);
  }
  for (const status of ["active", "trialing", "canceled", null, undefined]) {
    assert.equal(hasPaymentProblem(status), false, String(status));
  }
});

test("explains what happens when the period ends", () => {
  const currentPeriodEnd = new Date("2026-10-14T12:00:00Z");
  assert.equal(
    periodNote({ status: "trialing", cancelAtPeriodEnd: false, currentPeriodEnd }),
    "Free trial ends on Oct 14, 2026.",
  );
  assert.equal(
    periodNote({ status: "active", cancelAtPeriodEnd: false, currentPeriodEnd }),
    "Renews on Oct 14, 2026.",
  );
  for (const status of ["trialing", "active"]) {
    assert.equal(
      periodNote({ status, cancelAtPeriodEnd: true, currentPeriodEnd }),
      "Cancelled: Pro ends on Oct 14, 2026, then you're back on Free.",
    );
  }
  assert.equal(
    periodNote({ status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: null }),
    null,
  );
});

test("the payment warning says what happened", () => {
  assert.equal(paymentProblemTitle("past_due"), "Your last payment failed.");
  assert.equal(paymentProblemTitle("unpaid"), "Your last payment failed.");
  assert.equal(paymentProblemTitle("incomplete"), "Your first payment didn't go through.");
  assert.equal(
    paymentProblemTitle("paused"),
    "Pro is paused: the free trial ended without a card.",
  );
});

test("a failed payment never says it renews", () => {
  const currentPeriodEnd = new Date("2026-10-14T12:00:00Z");
  for (const status of ["past_due", "unpaid", "incomplete", "paused"]) {
    for (const cancelAtPeriodEnd of [false, true]) {
      assert.equal(periodNote({ status, cancelAtPeriodEnd, currentPeriodEnd }), null, status);
    }
  }
});

test("a subscription keeps charging until it's cancelled, also after a failed payment", () => {
  for (const status of ["active", "trialing", "past_due", "unpaid"]) {
    assert.equal(keepsCharging({ status, cancelAtPeriodEnd: false }), true, status);
    assert.equal(keepsCharging({ status, cancelAtPeriodEnd: true }), false, status);
  }
  for (const status of ["canceled", "incomplete", "incomplete_expired"]) {
    assert.equal(keepsCharging({ status, cancelAtPeriodEnd: false }), false, status);
  }
});
