"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";
import { getOrganizationSubscription } from "@/lib/billing";
import { planFromStatus } from "@/lib/billing/plans";
import { requireMembership, requirePermission } from "@/lib/session";

export async function renameOrganization(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "organization:update");

  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 60) {
    throw new Error("Name must be between 1 and 60 characters.");
  }

  await db.update(organizations).set({ name }).where(eq(organizations.id, organization.id));
  revalidatePath(`/dashboard/${slug}`, "layout");
}

export type DangerZoneState = { error?: string };

export async function leaveOrganization(_previous: DangerZoneState, formData: FormData): Promise<DangerZoneState> {
  const slug = String(formData.get("slug"));
  const { user, role, organization } = await requireMembership(slug);

  if (role === "owner") {
    const owners = await db.$count(
      memberships,
      and(eq(memberships.organizationId, organization.id), eq(memberships.role, "owner")),
    );
    if (owners <= 1) {
      return {
        error: "You're the only owner. Make another member an owner first, or delete the organization.",
      };
    }
  }

  await db
    .delete(memberships)
    .where(and(eq(memberships.organizationId, organization.id), eq(memberships.userId, user.id)));
  redirect("/dashboard");
}

export async function deleteOrganization(_previous: DangerZoneState, formData: FormData): Promise<DangerZoneState> {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "organization:delete");

  if (String(formData.get("confirmName") ?? "").trim() !== organization.name) {
    return { error: `Type "${organization.name}" exactly to confirm.` };
  }

  const subscription = await getOrganizationSubscription(organization.id);
  if (subscription && planFromStatus(subscription.status) === "pro" && !subscription.cancelAtPeriodEnd) {
    return {
      error: "This organization has an active subscription. Cancel it under Billing > Manage subscription first, so you aren't charged again.",
    };
  }

  await db.delete(organizations).where(eq(organizations.id, organization.id));
  redirect("/dashboard");
}
