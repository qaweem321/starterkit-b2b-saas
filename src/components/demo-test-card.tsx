"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoTestCard } from "@/lib/demo";

// Shown next to "Upgrade to Pro" in demo mode. The checkout page belongs to the payment
// provider, so we can't show these details there: copy them before leaving.
export function DemoTestCard() {
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(demoTestCard.number.replaceAll(" ", ""));
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the number is still on screen to type.
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-sm">
      <p className="font-medium">Demo test card (no real money)</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <dt>Card</dt>
        <dd className="flex flex-wrap items-center gap-2 font-mono text-foreground">
          {demoTestCard.number}
          <Button
            type="button"
            variant="link"
            size="inline"
            onClick={copyNumber}
            aria-label="Copy card number"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </dd>
        <dt>Expiry</dt>
        <dd className="font-mono text-foreground">{demoTestCard.expiry} (any future date)</dd>
        <dt>CVC</dt>
        <dd className="font-mono text-foreground">{demoTestCard.cvc} (any 3 digits)</dd>
      </dl>
      <p className="mt-2 text-subtle-foreground">Any name and address work too.</p>
    </div>
  );
}
