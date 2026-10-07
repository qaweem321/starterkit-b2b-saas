type Env = Record<string, string | undefined>;

// Demo mode is for a public demo without a verified email domain: sign-up skips email
// verification, no emails are sent and a banner explains it. Off unless DEMO_MODE="true".
export function isDemoMode(env: Env = process.env) {
  return env.DEMO_MODE === "true";
}
