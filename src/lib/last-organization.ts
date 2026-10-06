// The organization the user opened last, so logging in takes them back to it.
// Only a slug is stored; membership is always checked before using it.
export const LAST_ORGANIZATION_COOKIE = "last-organization";

// "/dashboard/acme/members" -> "acme". Returns null for other paths.
export function organizationSlugFromPath(pathname: string) {
  const [, first, slug] = pathname.split("/");
  return first === "dashboard" && slug ? slug : null;
}

// Prefer the last-used organization if the user still belongs to it, else the first one.
export function pickOrganization<T extends { slug: string }>(
  organizations: T[],
  lastSlug: string | undefined,
) {
  return organizations.find((organization) => organization.slug === lastSlug) ?? organizations[0];
}
