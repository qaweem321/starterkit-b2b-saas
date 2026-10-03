import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";
import { auth } from "@/lib/auth";

export const requireUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  return session.user;
});

export async function getUserOrganizations(userId: string) {
  return db
    .select({ name: organizations.name, slug: organizations.slug, role: memberships.role })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(eq(memberships.userId, userId))
    .orderBy(asc(organizations.name));
}

export const requireMembership = cache(async (slug: string) => {
  const user = await requireUser();

  const [membership] = await db
    .select({ organization: organizations, role: memberships.role })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(and(eq(organizations.slug, slug), eq(memberships.userId, user.id)))
    .limit(1);

  if (!membership) {
    notFound();
  }
  return { user, organization: membership.organization, role: membership.role };
});
