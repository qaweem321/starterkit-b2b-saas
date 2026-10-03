import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships, users } from "@/db/schema";
import { requireMembership } from "@/lib/session";

const roleStyles = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  member: "bg-gray-100 text-gray-700",
};

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization } = await requireMembership(slug);

  const members = await db
    .select({
      id: memberships.id,
      role: memberships.role,
      name: users.name,
      email: users.email,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .where(eq(memberships.organizationId, organization.id))
    .orderBy(asc(memberships.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold">Members</h1>
      <p className="mt-1 text-gray-600">Everyone who has access to {organization.name}.</p>

      <ul className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[member.role]}`}>
              {member.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
