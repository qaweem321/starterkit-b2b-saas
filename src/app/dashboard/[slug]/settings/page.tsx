import type { Metadata } from "next";
import { can } from "@/lib/permissions";
import { requireMembership } from "@/lib/session";
import { renameOrganization } from "./actions";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization, role } = await requireMembership(slug);
  const canEdit = can(role, "organization:update");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-gray-600">Manage your organization.</p>

      <form action={renameOrganization} className="mt-8 space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <label htmlFor="name" className="block text-sm font-medium">
          Organization name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={60}
          defaultValue={organization.name}
          disabled={!canEdit}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
        />
        {canEdit ? (
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Save
          </button>
        ) : (
          <p className="text-sm text-gray-500">Only owners and admins can change these settings.</p>
        )}
      </form>
    </div>
  );
}
