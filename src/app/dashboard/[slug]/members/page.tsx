import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships, users } from "@/db/schema";
import { can, roles } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { removeMember, updateMemberRole } from "./actions";

const roleStyles = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  member: "bg-gray-100 text-gray-700",
};

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user, role: myRole, organization } = await requireMembership(slug);

  const members = await db
    .select({
      id: memberships.id,
      userId: memberships.userId,
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
        {members.map((member) => {
          const isMe = member.userId === user.id;
          const canChangeRole = can(myRole, "member:update-role") && !isMe;
          const canRemove =
            can(myRole, "member:remove") && !isMe && !(member.role === "owner" && myRole !== "owner");

          return (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">
                  {member.name} {isMe && <span className="text-sm text-gray-400">(you)</span>}
                </p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {canChangeRole ? (
                  <form
                    key={`${member.id}-${member.role}`}
                    action={updateMemberRole}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="membershipId" value={member.id} />
                    <select
                      name="role"
                      defaultValue={member.role}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button className="text-sm text-blue-600 hover:underline">Save</button>
                  </form>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[member.role]}`}>
                    {member.role}
                  </span>
                )}

                {canRemove && (
                  <form action={removeMember}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="membershipId" value={member.id} />
                    <button className="text-sm text-red-600 hover:underline">Remove</button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
