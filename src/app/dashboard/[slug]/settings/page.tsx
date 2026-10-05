import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { renameOrganization } from "./actions";
import { DangerZone } from "./danger-zone";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);
  const canEdit = can(role, "organization:update");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your organization. Personal settings are under Account.</p>

      <form action={renameOrganization} className="mt-8 space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <label htmlFor="name" className="block text-sm font-medium">
          Organization name
        </label>
        <Input id="name" name="name" required maxLength={60} defaultValue={organization.name} disabled={!canEdit} />
        {canEdit ? (
          <Button>Save</Button>
        ) : (
          <p className="text-sm text-subtle-foreground">Only owners and admins can change these settings.</p>
        )}
      </form>

      <DangerZone slug={slug} organizationName={organization.name} canDelete={can(role, "organization:delete")} />
    </div>
  );
}
