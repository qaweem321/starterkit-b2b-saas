import { redirect } from "next/navigation";
import { getUserOrganizations, requireUser } from "@/lib/session";

export default async function DashboardIndexPage() {
  const user = await requireUser();
  const userOrganizations = await getUserOrganizations(user.id);

  if (userOrganizations.length === 0) {
    redirect("/onboarding");
  }
  redirect(`/dashboard/${userOrganizations[0].slug}`);
}
