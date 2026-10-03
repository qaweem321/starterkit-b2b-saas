"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { requirePermission } from "@/lib/session";

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
