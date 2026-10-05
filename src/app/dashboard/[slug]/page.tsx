import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { getOrganizationPlan } from "@/lib/billing";
import { plans } from "@/lib/billing/plans";
import { requireMembership } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);

  const memberCount = await db.$count(memberships, eq(memberships.organizationId, organization.id));

  const stats = [
    { label: "Members", value: String(memberCount) },
    { label: "Your role", value: role },
    { label: "Plan", value: plans[await getOrganizationPlan(organization.id)].name },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back. Here is what is happening in {organization.name}.
      </p>

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
