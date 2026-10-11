"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/session";

// On error, the typed values are sent back so the form can show them again.
export type ProjectFormState = { error?: string; name?: string; description?: string };

export async function createProject(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const slug = String(formData.get("slug"));
  // 1. Check the user's role in this organization before doing anything.
  const { user, organization } = await requirePermission(slug, "project:create");

  // 2. Validate input on the server; the browser can't be trusted.
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name || name.length > 80) {
    return { error: "Name must be between 1 and 80 characters.", name, description };
  }
  if (description.length > 500) {
    return { error: "Description must be 500 characters or less.", name, description };
  }

  // Anything cheap to repeat gets a limit (see AGENTS.md).
  const { allowed } = await rateLimit(`create-project:${user.id}`, 60, 60 * 60);
  if (!allowed) {
    return { error: "Too many new projects. Please try again in an hour.", name, description };
  }

  // 3. Always save the organization ID, so the row belongs to this organization only.
  await db.insert(projects).values({
    organizationId: organization.id,
    name,
    description: description || null,
    createdById: user.id,
  });
  revalidatePath(`/dashboard/${slug}/projects`);
  return {};
}

export async function deleteProject(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "project:delete");

  // Filter by organization too, so nobody can delete another organization's project
  // by sending its ID.
  await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, String(formData.get("projectId"))),
        eq(projects.organizationId, organization.id),
      ),
    );
  revalidatePath(`/dashboard/${slug}/projects`);
}
