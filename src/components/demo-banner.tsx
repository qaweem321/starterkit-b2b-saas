import { isDemoMode } from "@/lib/demo";

// Tells demo visitors what doesn't work, so missing emails don't look like a bug.
export function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }
  return (
    <p className="border-b border-border bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
      <strong className="text-foreground">Live demo:</strong> emails are turned off, so you can sign
      up with any address. Payments are in test mode: use card 4242 4242 4242 4242.
    </p>
  );
}
