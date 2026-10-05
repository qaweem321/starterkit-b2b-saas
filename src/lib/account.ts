import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";
import { hasRenewingSubscription } from "@/lib/billing";

type AccountDeletionPlan = {
  // Reasons the account can't be deleted yet. Empty means it can.
  blockers: string[];
  // Organizations where the user is the only member. They are deleted with the account.
  soloOrganizations: { id: string; name: string }[];
};

// Decides what happens to the user's organizations when they delete their account.
export async function planAccountDeletion(userId: string): Promise<AccountDeletionPlan> {
  const owned = await db
    .select({ id: organizations.id, name: organizations.name })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(and(eq(memberships.userId, userId), eq(memberships.role, "owner")));

  const plan: AccountDeletionPlan = { blockers: [], soloOrganizations: [] };

  for (const organization of owned) {
    const members = await db.$count(memberships, eq(memberships.organizationId, organization.id));
    const owners = await db.$count(
      memberships,
      and(eq(memberships.organizationId, organization.id), eq(memberships.role, "owner")),
    );

    if (members === 1) {
      if (await hasRenewingSubscription(organization.id)) {
        plan.blockers.push(
          `${organization.name} has an active subscription. Cancel it under Billing > Manage subscription first.`,
        );
      } else {
        plan.soloOrganizations.push(organization);
      }
    } else if (owners === 1) {
      plan.blockers.push(
        `You're the only owner of ${organization.name}. Make another member an owner first.`,
      );
    }
  }
  return plan;
}

export async function deleteOrganizations(ids: string[]) {
  if (ids.length > 0) {
    await db.delete(organizations).where(inArray(organizations.id, ids));
  }
}
