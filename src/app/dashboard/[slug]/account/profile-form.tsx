"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ProfileForm({ name }: { name: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const newName = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!newName) {
      setMessage({ type: "error", text: "Please enter your name." });
      return;
    }

    setLoading(true);
    const { error } = await authClient.updateUser({ name: newName });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message ?? "Could not update your name." });
      return;
    }
    setMessage({ type: "success", text: "Name updated." });
    router.refresh();
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="account-name" className="block text-sm font-medium">
        Name
      </label>
      <input
        id="account-name"
        name="name"
        required
        maxLength={60}
        defaultValue={name}
        autoComplete="name"
        className="w-full rounded-lg border border-input px-3 py-2"
      />
      <button
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-success" : "text-danger"}`}>{message.text}</p>
      )}
    </form>
  );
}
