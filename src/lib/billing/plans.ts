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

// The subscription still exists but the last payment failed (e.g. an expired card).
// The owner should update the card in the billing portal, not start a new subscription.
const PAYMENT_PROBLEM_STATUSES = ["past_due", "unpaid", "incomplete"];

export function hasPaymentProblem(status: string | null | undefined) {
  return Boolean(status && PAYMENT_PROBLEM_STATUSES.includes(status));
}

type PeriodInfo = { status: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: Date | null };

// What happens when the current period ends, shown on the Billing page.
// A cancelled subscription keeps Pro until then, so say that clearly (also during a trial).
export function periodNote({ status, cancelAtPeriodEnd, currentPeriodEnd }: PeriodInfo) {
  if (!currentPeriodEnd) {
    return null;
  }
  const date = formatDate(currentPeriodEnd);
  if (cancelAtPeriodEnd) {
    return `Cancelled: Pro ends on ${date}, then you're back on Free.`;
  }
  return status === "trialing" ? `Free trial ends on ${date}.` : `Renews on ${date}.`;
}
