"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, type ProjectFormState } from "./actions";

export function ProjectForm({ slug }: { slug: string }) {
  const [state, formAction, isPending] = useActionState(createProject, {} as ProjectFormState);
  return (
    <form action={formAction} className="mt-8 space-y-2">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex flex-wrap gap-2">
        <Input
          name="name"
          required
          maxLength={80}
          defaultValue={state.name}
          placeholder="Project name"
        />
        <Input
          name="description"
          maxLength={500}
          defaultValue={state.description}
          placeholder="Description (optional)"
          className="flex-1 min-w-56"
        />
        <Button disabled={isPending}>{isPending ? "Adding..." : "Add project"}</Button>
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
