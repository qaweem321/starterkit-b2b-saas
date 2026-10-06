import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { PaymentProblemNotice } from "@/components/payment-problem-notice";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { getOrganizationSubscription } from "@/lib/billing";
import { hasPaymentProblem, planFromStatus, plans } from "@/lib/billing/plans";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);

  const [memberCount, subscription] = await Promise.all([
    db.$count(memberships, eq(memberships.organizationId, organization.id)),
    getOrganizationSubscription(organization.id),
  ]);
  const planId = planFromStatus(subscription?.status);

  const stats = [
    { label: "Members", value: String(memberCount) },
    { label: "Your role", value: role },
    { label: "Plan", value: plans[planId].name },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back. Here is what is happening in {organization.name}.
      </p>

      {hasPaymentProblem(subscription?.status) && (
        <PaymentProblemNotice slug={slug} canManage={can(role, "billing:manage")} showBillingLink />
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border p-5">
            <p className="text-sm text-subtle-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold capitalize">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
