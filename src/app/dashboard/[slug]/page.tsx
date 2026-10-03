import { eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { requireMembership } from "@/lib/session";

export default async function OverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);

  const memberCount = await db.$count(memberships, eq(memberships.organizationId, organization.id));

  const stats = [
    { label: "Members", value: String(memberCount) },
    { label: "Your role", value: role },
    { label: "Plan", value: "Free" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-gray-600">
        Welcome back. Here is what is happening in {organization.name}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold capitalize">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
