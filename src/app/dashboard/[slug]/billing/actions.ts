"use server";

import { redirect } from "next/navigation";
import { getBillingProvider } from "@/lib/billing";
import { requirePermission } from "@/lib/session";

export async function startCheckout(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "billing:manage");

  const url = await getBillingProvider().createCheckoutUrl({
    organizationId: organization.id,
    successUrl: `${process.env.BETTER_AUTH_URL}/dashboard/${slug}/billing/success`,
    cancelUrl: `${process.env.BETTER_AUTH_URL}/dashboard/${slug}/billing`,
  });
  redirect(url);
}

export async function openBillingPortal(formData: FormData) {
  const slug = String(formData.get("slug"));
  const { organization } = await requirePermission(slug, "billing:manage");

  const url = await getBillingProvider().createPortalUrl({
    organizationId: organization.id,
    returnUrl: `${process.env.BETTER_AUTH_URL}/dashboard/${slug}/billing`,
  });
  redirect(url);
}
