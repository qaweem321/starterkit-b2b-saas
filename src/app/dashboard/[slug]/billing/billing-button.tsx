"use client";

import { useActionState } from "react";
import type { BillingActionState } from "./actions";

type Props = {
  slug: string;
  label: string;
  action: (previous: BillingActionState, formData: FormData) => Promise<BillingActionState>;
};

export function BillingButton({ slug, label, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="slug" value={slug} />
      <button
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Redirecting..." : label}
      </button>
      {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
    </form>
  );
}
