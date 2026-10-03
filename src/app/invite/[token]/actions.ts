"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invitations, memberships } from "@/db/schema";
import { findValidInvitation } from "@/lib/invitations";
import { requireUser } from "@/lib/session";

export async function acceptInvitation(formData: FormData) {
  const user = await requireUser();
  const found = await findValidInvitation(String(formData.get("token")));

  if (!found || found.invitation.email !== user.email.toLowerCase()) {
    throw new Error("This invitation is invalid, expired, or for a different email.");
  }

  await db.batch([
    db
      .insert(memberships)
      .values({
        organizationId: found.organization.id,
        userId: user.id,
        role: found.invitation.role,
      })
      .onConflictDoNothing(),
    db.delete(invitations).where(eq(invitations.id, found.invitation.id)),
  ]);

  redirect(`/dashboard/${found.organization.slug}`);
}
