import { webhooks } from "@polar-sh/sdk/2026-10";
import { syncSubscription } from "@/lib/billing";

export async function POST(request: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "POLAR_WEBHOOK_SECRET is not set" }, { status: 500 });
  }

  const body = await request.text();
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
  };

  let event;
  try {
    event = await webhooks.validateEvent(body, headers, secret);
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookVerificationError) {
      return Response.json({ error: "Invalid signature" }, { status: 403 });
    }
    if (error instanceof webhooks.PolarWebhookUnknownTypeError) {
      return new Response(null, { status: 202 });
    }
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  let organizationId: string | null | undefined;
  if (event.type === "customer.state_changed") {
    organizationId = event.data.external_id;
  } else if (event.type.startsWith("subscription.") && "customer" in event.data) {
    organizationId = event.data.customer.external_id;
  }

  if (organizationId) {
    await syncSubscription(organizationId);
  }
  return new Response(null, { status: 202 });
}
