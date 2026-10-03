"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { invitations, memberships, users } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { isRole } from "@/lib/permissions";
import { requirePermission } from "@/lib/session";

const INVITE_DAYS = 7;

async function findMembership(membershipId: string, organizationId: string) {
  const [membership] = await db
    .select()
    .from(memberships)
    .where(and(eq(memberships.id, membershipId), eq(memberships.organizationId, organizationId)));

  if (!membership) {
    throw new Error("Member not found.");
  }
  return membership;
}

export async function updateMemberRole(formData: FormData) {
  const slug = String(formData.get("slug"));
  const newRole = String(formData.get("role"));
  const { user, organization } = await requirePermission(slug, "member:update-role");

  if (!isRole(newRole)) {
    throw new Error("Invalid role.");
  }
  const target = await findMembership(String(formData.get("membershipId")), organization.id);
  if (target.userId === user.id) {
    throw new Error("You can't change your own role.");
  }

  await db.update(memberships).set({ role: newRole }).where(eq(memberships.id, target.id));
  revalidatePath(`/dashboard/${slug}/members`);
}

export async function removeMember(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { user, role, organization } = await requirePermission(slug, "member:remove");

  const target = await findMembership(String(formData.get("membershipId")), organization.id);
  if (target.userId === user.id) {
    throw new Error("You can't remove yourself.");
  }
  if (target.role === "owner" && role !== "owner") {
    throw new Error("Only owners can remove an owner.");
  }

  await db.delete(memberships).where(eq(memberships.id, target.id));
  revalidatePath(`/dashboard/${slug}/members`);
}

export type InviteState = {
  error?: string;
  success?: string;
  email?: string;
};

export async function inviteMember(_previous: InviteState, formData: FormData): Promise<InviteState> {
  const slug = String(formData.get("slug"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role"));
  const { user, role: myRole, organization } = await requirePermission(slug, "member:invite");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", email };
  }
  if (!isRole(role)) {
    return { error: "Please choose a valid role.", email };
  }
  if (role === "owner" && myRole !== "owner") {
    return { error: "Only owners can invite owners.", email };
  }

  const alreadyMember = await db
    .select({ id: memberships.id })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .where(and(eq(memberships.organizationId, organization.id), eq(users.email, email)));
  if (alreadyMember.length > 0) {
    return { error: "That person is already a member.", email };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000);

  await db
    .insert(invitations)
    .values({ organizationId: organization.id, email, role, token, invitedById: user.id, expiresAt })
    .onConflictDoUpdate({
      target: [invitations.organizationId, invitations.email],
      set: { role, token, invitedById: user.id, expiresAt },
    });

  revalidatePath(`/dashboard/${slug}/members`);

  const link = `${process.env.BETTER_AUTH_URL}/invite/${token}`;
  try {
    await sendEmail({
      to: email,
      subject: `${user.name} invited you to join ${organization.name}`,
      text: `${user.name} invited you to join ${organization.name} as ${role}.\n\nAccept the invitation: ${link}\n\nThis link expires in ${INVITE_DAYS} days.`,
    });
  } catch (error) {
    console.error(error);
    return { error: `Invitation saved, but the email to ${email} could not be sent.`, email };
  }

  return { success: `Invitation sent to ${email}.` };
}

export async function revokeInvitation(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "member:invite");

  await db
    .delete(invitations)
    .where(
      and(
        eq(invitations.id, String(formData.get("invitationId"))),
        eq(invitations.organizationId, organization.id),
      ),
    );
  revalidatePath(`/dashboard/${slug}/members`);
}
