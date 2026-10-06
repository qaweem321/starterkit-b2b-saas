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
