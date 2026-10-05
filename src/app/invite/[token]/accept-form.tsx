"use client";

import { useActionState } from "react";
import { acceptInvitation } from "./actions";

export function AcceptForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(acceptInvitation, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <button
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Joining..." : "Accept invitation"}
      </button>
      {state.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}
    </form>
  );
}
