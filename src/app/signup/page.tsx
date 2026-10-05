"use client";

import Link from "next/link";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { getNextPath } from "@/lib/safe-redirect";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email,
      password: String(form.get("password")),
      callbackURL: getNextPath(),
    });

    setLoading(false);
    if (error) {
      setError(error.message ?? "Something went wrong");
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We sent a verification link to <strong className="text-foreground">{sentTo}</strong>. Click it to finish
            creating your account. Don&apos;t forget to check your spam folder.
          </p>
          <p className="text-sm text-muted-foreground">
            Already verified?{" "}
            <Link href="/login" className="text-link hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form method="post" onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create your account</h1>

        <input name="name" required placeholder="Full name" className="w-full rounded-lg border border-input px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-input px-3 py-2" />
        <PasswordInput name="password" minLength={8} autoComplete="new-password" placeholder="Password (8+ characters)" />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-link hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
