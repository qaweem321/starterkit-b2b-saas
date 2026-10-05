"use server";

import { redirect } from "next/navigation";
import { absoluteUrl } from "@/config/site";
import { getBillingProvider } from "@/lib/billing";
import { requirePermission } from "@/lib/session";

export type BillingActionState = { error?: string };

const PROVIDER_ERROR = "We couldn't reach the payment provider. Please try again in a moment.";

export async function startCheckout(
  _previous: BillingActionState,
  formData: FormData,
): Promise<BillingActionState> {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "billing:manage");

  let url: string;
  try {
    url = await getBillingProvider().createCheckoutUrl({
      organizationId: organization.id,
      successUrl: absoluteUrl(`/dashboard/${slug}/billing/success`),
      cancelUrl: absoluteUrl(`/dashboard/${slug}/billing`),
    });
  } catch (error) {
    console.error("Checkout failed:", error);
    return { error: PROVIDER_ERROR };
  }
  redirect(url);
}

export async function openBillingPortal(
  _previous: BillingActionState,
  formData: FormData,
): Promise<BillingActionState> {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "billing:manage");

  let url: string;
  try {
    url = await getBillingProvider().createPortalUrl({
      organizationId: organization.id,
      returnUrl: absoluteUrl(`/dashboard/${slug}/billing`),
    });
  } catch (error) {
    console.error("Billing portal failed:", error);
    return { error: PROVIDER_ERROR };
  }
  redirect(url);
}
