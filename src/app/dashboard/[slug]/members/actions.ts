"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { isRole } from "@/lib/permissions";
import { requirePermission } from "@/lib/session";

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
