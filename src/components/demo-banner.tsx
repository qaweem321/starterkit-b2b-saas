import { isDemoMode } from "@/lib/demo";

// Tells demo visitors what doesn't work and how to test-pay, so nothing looks like a bug.
export function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }
  return (
    <p className="border-b border-border bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
      <strong className="text-foreground">Live demo:</strong> emails are turned off, so you can sign
      up with any address. To try Pro, pay with test card 4242 4242 4242 4242, any future expiry
      date (like 12/34) and any 3-digit CVC. No real money is charged.
    </p>
  );
}
