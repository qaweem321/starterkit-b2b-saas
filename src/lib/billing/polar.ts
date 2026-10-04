import { PolarClientError } from "@polar-sh/sdk";
import { createPolar } from "@polar-sh/sdk/2026-10";
import { requireEnv } from "./env";
import type { BillingProvider } from "./types";

function getClient() {
  return createPolar({
    accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
    environment: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
  });
}

export const polarProvider: BillingProvider = {
  name: "polar",

  async createCheckoutUrl({ organizationId, successUrl, cancelUrl }) {
    const checkout = await getClient().checkouts.create({
      products: [requireEnv("POLAR_PRO_PRODUCT_ID")],
      external_customer_id: organizationId,
      success_url: successUrl,
      return_url: cancelUrl,
    });
    return checkout.url;
  },

  async createPortalUrl({ organizationId, returnUrl }) {
    const session = await getClient().customerSessions.create({
      external_customer_id: organizationId,
      return_url: returnUrl,
    });
    return session.customer_portal_url;
  },

  async fetchSubscription(organizationId) {
    try {
      const state = await getClient().customers.getStateExternal(organizationId);
      const subscription = state.active_subscriptions[0];
      if (!subscription) {
        return null;
      }
      return {
        providerCustomerId: state.id,
        providerSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    } catch (error) {
      if (error instanceof PolarClientError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
