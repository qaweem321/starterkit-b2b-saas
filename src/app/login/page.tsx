"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { getNextPath } from "@/lib/safe-redirect";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const { error } = await authClient.signIn.email({
      email,
      password: String(form.get("password")),
      callbackURL: getNextPath(),
    });

    setLoading(false);
    if (error) {
      setError(
        error.code === "EMAIL_NOT_VERIFIED"
          ? `Please verify your email first. We've sent a new link to ${email}.`
          : (error.message ?? "Something went wrong"),
      );
      return;
    }
    router.push(getNextPath());
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form method="post" onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Log in</h1>

        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-input px-3 py-2" />
        <PasswordInput name="password" autoComplete="current-password" placeholder="Password" />
        <Link href="/forgot-password" className="block text-right text-sm text-link hover:underline">
          Forgot password?
        </Link>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/signup" className="text-link hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
