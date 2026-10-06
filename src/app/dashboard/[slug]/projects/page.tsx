import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/submit-button";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { deleteProject } from "./actions";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = { title: "Projects" };

// Example feature. Copy this folder (page, form, actions) and the `projects` table
// in src/db/schema.ts to build your own organization-scoped feature.
export default async function ProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      createdAt: projects.createdAt,
      createdBy: users.name,
    })
    .from(projects)
    .leftJoin(users, eq(projects.createdById, users.id))
    .where(eq(projects.organizationId, organization.id))
    .orderBy(desc(projects.createdAt));

  const canDelete = can(role, "project:delete");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Projects</h1>
      <p className="mt-1 text-muted-foreground">
        An example feature. Everyone in {organization.name} can see and add projects.
      </p>

      {can(role, "project:create") && <ProjectForm slug={slug} />}

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first project with the form above.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-xl border border-border">
          {rows.map((project) => (
            <li key={project.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium">{project.name}</p>
                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                )}
                <p className="mt-1 text-xs text-subtle-foreground">
                  Added {formatDate(project.createdAt)}
                  {project.createdBy && ` by ${project.createdBy}`}
                </p>
              </div>
              {canDelete && (
                <form action={deleteProject}>
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <SubmitButton
                    variant="danger-link"
                    size="inline"
                    pendingText="Deleting..."
                    confirm={`Delete "${project.name}"? This cannot be undone.`}
                    aria-label={`Delete ${project.name}`}
                  >
                    Delete
                  </SubmitButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
