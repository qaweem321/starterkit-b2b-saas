"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";
import { requireUser } from "@/lib/session";

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "org";
}

export async function createOrganization(formData: FormData) {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/onboarding");
  }

  let slug = slugify(name);
  const taken = await db.$count(organizations, eq(organizations.slug, slug));
  if (taken > 0) {
    slug = `${slug}-${randomUUID().slice(0, 6)}`;
  }

  const organizationId = randomUUID();
  await db.batch([
    db.insert(organizations).values({ id: organizationId, name, slug }),
    db.insert(memberships).values({ organizationId, userId: user.id, role: "owner" }),
  ]);

  redirect(`/dashboard/${slug}`);
}
