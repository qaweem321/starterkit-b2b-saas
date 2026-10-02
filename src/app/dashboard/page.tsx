import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";

export default async function DashboardPage() {
  await connection();
  const [organization] = await db.select().from(organizations).limit(1);

  if (!organization) {
    return <p className="text-gray-600">No organization yet. Run npm run db:seed.</p>;
  }

  const memberCount = await db.$count(memberships, eq(memberships.organizationId, organization.id));

  const stats = [
    { label: "Members", value: String(memberCount) },
    { label: "Plan", value: "Free" },
    { label: "Projects", value: "12" },
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
            <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
