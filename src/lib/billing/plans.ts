export const plans = {
  free: { name: "Free", price: "$0", memberLimit: 3 },
  pro: { name: "Pro", price: "$29/month", memberLimit: Infinity },
} as const;

export type PlanId = keyof typeof plans;

const PAID_STATUSES = ["active", "trialing"];

export function planFromStatus(status: string | null | undefined): PlanId {
  return status && PAID_STATUSES.includes(status) ? "pro" : "free";
}
