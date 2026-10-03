"use client";

import { useActionState } from "react";
import type { Role } from "@/lib/permissions";
import { inviteMember, type InviteState } from "./actions";

type Props = {
  slug: string;
  roles: readonly Role[];
};

export function InviteForm({ slug, roles }: Props) {
  const [state, formAction, isPending] = useActionState(inviteMember, {} as InviteState);

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex flex-wrap gap-2">
        <input
          name="email"
          type="email"
          required
          defaultValue={state.email}
          placeholder="teammate@company.com"
          className="flex-1 min-w-56 rounded-lg border border-gray-300 px-3 py-2"
        />
        <select name="role" defaultValue="member" className="rounded-lg border border-gray-300 px-3 py-2">
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Invite"}
        </button>
      </div>

      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="mt-2 text-sm text-green-700">{state.success}</p>}
    </form>
  );
}
