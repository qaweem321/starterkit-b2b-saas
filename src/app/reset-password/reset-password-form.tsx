"use client";

import Link from "next/link";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirmPassword"))) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    setLoading(false);

    if (error) {
      setError(error.message ?? "This reset link is invalid or has expired.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-success">Your password has been changed. You can now log in with it.</p>
        <Link href="/login" className="block w-full rounded-lg bg-blue-600 py-2 text-center font-medium text-white hover:bg-blue-700">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput name="password" minLength={8} autoComplete="new-password" placeholder="New password (8+ characters)" />
      <PasswordInput name="confirmPassword" minLength={8} autoComplete="new-password" placeholder="Confirm new password" />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save new password"}
      </button>
    </form>
  );
}
