"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
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
      <Button disabled={isPending}>{isPending ? "Redirecting..." : label}</Button>
      {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
    </form>
  );
}
