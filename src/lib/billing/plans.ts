import { formatDate } from "@/lib/format";

// Plan details used by the pricing section, billing page and member limits.
// The real price is set in Polar or Stripe; keep `price` here in sync with it.
export const plans = {
  free: {
    name: "Free",
    price: "$0",
    description: "For small teams getting started.",
    memberLimit: 3,
    features: ["Organizations and roles", "Email invitations", "Community support"],
  },
  pro: {
    name: "Pro",
    price: "$29/month",
    description: "For growing teams that need more seats.",
    memberLimit: Infinity,
    features: ["Everything in Free", "Billing portal and invoices", "Priority email support"],
  },
} as const;

export type PlanId = keyof typeof plans;
export type Plan = (typeof plans)[PlanId];

export function memberLimitLabel(memberLimit: number) {
  return memberLimit === Infinity ? "Unlimited members" : `Up to ${memberLimit} members`;
}

const PAID_STATUSES = ["active", "trialing"];

export function planFromStatus(status: string | null | undefined): PlanId {
  return status && PAID_STATUSES.includes(status) ? "pro" : "free";
}

// The subscription still exists but isn't being paid: the last payment failed (e.g. an expired
// card), the first one didn't go through, or (Stripe) a trial ended without a card, which
// pauses it. The owner should fix the card in the billing portal, not start a new subscription.
const PAYMENT_PROBLEM_STATUSES = ["past_due", "unpaid", "incomplete", "paused"];

export function hasPaymentProblem(status: string | null | undefined) {
  return Boolean(status && PAYMENT_PROBLEM_STATUSES.includes(status));
}

// The headline of the payment warning, matching what actually happened.
export function paymentProblemTitle(status: string | null | undefined) {
  if (status === "paused") {
    return "Pro is paused: the free trial ended without a card.";
  }
  if (status === "incomplete") {
    return "Your first payment didn't go through.";
  }
  return "Your last payment failed.";
}

// Statuses where Stripe or Polar charges the card again, or keeps retrying a failed payment.
const CHARGING_STATUSES = ["active", "trialing", "past_due", "unpaid"];

// True while the organization would be charged again. Deleting it then would leave the
// subscription running, so the owner must cancel it in the billing portal first.
export function keepsCharging(subscription: { status: string; cancelAtPeriodEnd: boolean }) {
  return CHARGING_STATUSES.includes(subscription.status) && !subscription.cancelAtPeriodEnd;
}

type PeriodInfo = { status: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: Date | null };

// What happens when the current period ends, shown on the Billing page.
// A cancelled subscription keeps Pro until then, so say that clearly (also during a trial).
// With a payment problem nothing renews until the card is fixed: the payment warning says so,
// and no date is shown ("Renews on" next to "payment failed" would be wrong).
export function periodNote({ status, cancelAtPeriodEnd, currentPeriodEnd }: PeriodInfo) {
  if (!currentPeriodEnd || hasPaymentProblem(status)) {
    return null;
  }
  const date = formatDate(currentPeriodEnd);
  if (cancelAtPeriodEnd) {
    return `Cancelled: Pro ends on ${date}, then you're back on Free.`;
  }
  return status === "trialing" ? `Free trial ends on ${date}.` : `Renews on ${date}.`;
}
