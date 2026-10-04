import { getOrganizationSubscription } from "@/lib/billing";
import { planFromStatus, plans } from "@/lib/billing/plans";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { openBillingPortal, startCheckout } from "./actions";
import { BillingButton } from "./billing-button";

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
      <p className="mt-1 text-gray-600">Manage the plan for {organization.name}.</p>

      <div className="mt-8 rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Current plan</p>
        <p className="mt-1 text-3xl font-semibold">{plan.name}</p>
        <p className="mt-1 text-sm text-gray-600">
          {plan.memberLimit === Infinity ? "Unlimited members" : `Up to ${plan.memberLimit} members`}
        </p>

        {subscription?.currentPeriodEnd && (
          <p className="mt-3 text-sm text-gray-600">
            {subscription.cancelAtPeriodEnd ? "Ends on " : "Renews on "}
            {subscription.currentPeriodEnd.toLocaleDateString()}
          </p>
        )}

        {canManage ? (
          planId === "pro" ? (
            <BillingButton slug={slug} action={openBillingPortal} label="Manage subscription" />
          ) : (
            <BillingButton slug={slug} action={startCheckout} label={`Upgrade to Pro (${plans.pro.price})`} />
          )
        ) : (
          <p className="mt-6 text-sm text-gray-500">Only owners can change the plan.</p>
        )}
      </div>
    </div>
  );
}
