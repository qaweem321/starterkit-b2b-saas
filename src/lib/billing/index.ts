import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { planFromStatus, type PlanId } from "./plans";
import { polarProvider } from "./polar";
import type { BillingProvider } from "./types";

export function getBillingProvider(): BillingProvider {
  const provider = process.env.BILLING_PROVIDER ?? "polar";
  if (provider === "polar") {
    return polarProvider;
  }
  throw new Error(`Unknown BILLING_PROVIDER "${provider}". Use "polar".`);
}

export async function syncSubscription(organizationId: string) {
  const provider = getBillingProvider();
  const subscription = await provider.fetchSubscription(organizationId);

  if (!subscription) {
    await db.delete(subscriptions).where(eq(subscriptions.organizationId, organizationId));
    return;
  }

  const values = { ...subscription, provider: provider.name, updatedAt: new Date() };
  await db
    .insert(subscriptions)
    .values({ organizationId, ...values })
    .onConflictDoUpdate({ target: subscriptions.organizationId, set: values });
}

export async function getOrganizationSubscription(organizationId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId));
  return subscription ?? null;
}

export async function getOrganizationPlan(organizationId: string): Promise<PlanId> {
  const subscription = await getOrganizationSubscription(organizationId);
  return planFromStatus(subscription?.status);
}
