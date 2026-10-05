import type { Metadata } from "next";
import { getOrganizationSubscription } from "@/lib/billing";
import { memberLimitLabel, planFromStatus, plans } from "@/lib/billing/plans";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { openBillingPortal, startCheckout } from "./actions";
import { BillingButton } from "./billing-button";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);
  const subscription = await getOrganizationSubscription(organization.id);
  const planId = planFromStatus(subscription?.status);
  const plan = plans[planId];
  const canManage = can(role, "billing:manage");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="mt-1 text-muted-foreground">Manage the plan for {organization.name}.</p>

      <div className="mt-8 rounded-xl border border-border p-6">
        <p className="text-sm text-subtle-foreground">Current plan</p>
        <p className="mt-1 text-3xl font-semibold">{plan.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{memberLimitLabel(plan.memberLimit)}</p>

        {subscription?.currentPeriodEnd && (
          <p className="mt-3 text-sm text-muted-foreground">
            {subscription.cancelAtPeriodEnd ? "Ends on " : "Renews on "}
            {subscription.currentPeriodEnd.toLocaleDateString()}
          </p>
        )}

        {canManage ? (
          planId === "pro" ? (
            <BillingButton slug={slug} action={openBillingPortal} label="Manage subscription" />
          ) : (
            <BillingButton
              slug={slug}
              action={startCheckout}
              label={`Upgrade to Pro (${plans.pro.price})`}
            />
          )
        ) : (
          <p className="mt-6 text-sm text-subtle-foreground">Only owners can change the plan.</p>
        )}
      </div>
    </div>
  );
}
