"use client";

import { useActionState } from "react";
import { deleteOrganization, leaveOrganization } from "./actions";

type Props = {
  slug: string;
  organizationName: string;
  canDelete: boolean;
};

export function DangerZone({ slug, organizationName, canDelete }: Props) {
  const [leaveState, leaveAction, leaving] = useActionState(leaveOrganization, {});
  const [deleteState, deleteAction, deleting] = useActionState(deleteOrganization, {});

  return (
    <section className="mt-10 rounded-xl border border-danger/40 p-6 space-y-8">
      <h2 className="text-lg font-semibold text-danger">Danger zone</h2>

      <form
        action={leaveAction}
        onSubmit={(event) => {
          if (!window.confirm(`Leave ${organizationName}? You'll need a new invitation to come back.`)) {
            event.preventDefault();
          }
        }}
        className="space-y-3"
      >
        <input type="hidden" name="slug" value={slug} />
        <div>
          <p className="font-medium">Leave organization</p>
          <p className="text-sm text-muted-foreground">You will lose access to {organizationName}.</p>
        </div>
        <button
          disabled={leaving}
          className="rounded-lg border border-danger/60 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
        >
          {leaving ? "Leaving..." : "Leave organization"}
        </button>
        {leaveState.error && <p className="text-sm text-danger">{leaveState.error}</p>}
      </form>

      {canDelete && (
        <form action={deleteAction} className="space-y-3 border-t border-border pt-8">
          <input type="hidden" name="slug" value={slug} />
          <div>
            <p className="font-medium">Delete organization</p>
            <p className="text-sm text-muted-foreground">
              Permanently deletes {organizationName}, its members&apos; access and pending invitations. This cannot be
              undone.
            </p>
          </div>
          <label htmlFor="confirmName" className="block text-sm">
            Type <strong>{organizationName}</strong> to confirm.
          </label>
          <input
            id="confirmName"
            name="confirmName"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-input px-3 py-2"
          />
          <button
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete organization"}
          </button>
          {deleteState.error && <p className="text-sm text-danger">{deleteState.error}</p>}
        </form>
      )}
    </section>
  );
}
