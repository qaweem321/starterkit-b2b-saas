import assert from "node:assert/strict";
import { test } from "node:test";
import { organizationSlugFromPath, pickOrganization } from "./last-organization";

test("reads the organization slug from dashboard paths only", () => {
  assert.equal(organizationSlugFromPath("/dashboard/acme/members"), "acme");
  assert.equal(organizationSlugFromPath("/dashboard/acme"), "acme");
  assert.equal(organizationSlugFromPath("/dashboard"), null);
  assert.equal(organizationSlugFromPath("/onboarding"), null);
});

test("prefers the last-used organization, if the user still belongs to it", () => {
  const organizations = [{ slug: "acme" }, { slug: "studio" }];
  assert.equal(pickOrganization(organizations, "studio")?.slug, "studio");
  assert.equal(pickOrganization(organizations, "left-long-ago")?.slug, "acme");
  assert.equal(pickOrganization(organizations, undefined)?.slug, "acme");
  assert.equal(pickOrganization([], "acme"), undefined);
});
