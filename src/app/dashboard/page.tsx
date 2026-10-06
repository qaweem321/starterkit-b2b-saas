import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LAST_ORGANIZATION_COOKIE, pickOrganization } from "@/lib/last-organization";
import { getUserOrganizations, requireUser } from "@/lib/session";

// Opens the organization the user used last (or their first one).
export default async function DashboardIndexPage() {
  const user = await requireUser();
  const [userOrganizations, cookieStore] = await Promise.all([
    getUserOrganizations(user.id),
    cookies(),
  ]);

  const organization = pickOrganization(
    userOrganizations,
    cookieStore.get(LAST_ORGANIZATION_COOKIE)?.value,
  );
  if (!organization) {
    redirect("/onboarding");
  }
  redirect(`/dashboard/${organization.slug}`);
}
