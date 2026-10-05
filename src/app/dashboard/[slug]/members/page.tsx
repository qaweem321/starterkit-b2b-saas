import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { invitations, memberships, users } from "@/db/schema";
import { can, roles } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { removeMember, revokeInvitation, updateMemberRole } from "./actions";
import { InviteForm } from "./invite-form";

export const metadata: Metadata = { title: "Members" };

const roleStyles = {
  owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  member: "bg-muted text-secondary-foreground",
};

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user, role: myRole, organization } = await requireMembership(slug);

  const canInvite = can(myRole, "member:invite");

  const [members, pendingInvitations] = await Promise.all([
    db
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
      .orderBy(asc(memberships.createdAt)),
    canInvite
      ? db
          .select()
          .from(invitations)
          .where(eq(invitations.organizationId, organization.id))
          .orderBy(asc(invitations.createdAt))
      : Promise.resolve([]),
  ]);
  const invitableRoles = myRole === "owner" ? roles : roles.filter((role) => role !== "owner");

  return (
    <div>
      <h1 className="text-2xl font-bold">Members</h1>
      <p className="mt-1 text-muted-foreground">Everyone who has access to {organization.name}.</p>

      {canInvite && <InviteForm slug={slug} roles={invitableRoles} />}

      <ul className="mt-8 divide-y divide-border rounded-xl border border-border">
        {members.map((member) => {
          const isMe = member.userId === user.id;
          const canChangeRole = can(myRole, "member:update-role") && !isMe;
          const canRemove =
            can(myRole, "member:remove") && !isMe && !(member.role === "owner" && myRole !== "owner");

          return (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">
                  {member.name} {isMe && <span className="text-sm text-faint-foreground">(you)</span>}
                </p>
                <p className="text-sm text-subtle-foreground">{member.email}</p>
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
                      className="rounded-md border border-input px-2 py-1 text-sm"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button className="text-sm text-link hover:underline">Save</button>
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
                    <button className="text-sm text-danger hover:underline">Remove</button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {pendingInvitations.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Pending invitations</h2>
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
            {pendingInvitations.map((invitation) => {
              const expired = invitation.expiresAt < new Date();
              return (
                <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-subtle-foreground">
                      Invited as {invitation.role} ·{" "}
                      {expired ? (
                        <span className="text-danger">expired</span>
                      ) : (
                        `expires ${invitation.expiresAt.toLocaleDateString()}`
                      )}
                    </p>
                  </div>
                  <form action={revokeInvitation}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="invitationId" value={invitation.id} />
                    <button className="text-sm text-danger hover:underline">Revoke</button>
                  </form>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
