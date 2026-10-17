// Must come first: the database connection reads DATABASE_URL when it is imported.
import "./load-env";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { closeDb, db } from "./index";
import { memberships, organizations, projects, users } from "./schema";

const demoMembers = [
  { name: "Olivia Owner", email: "owner@acme.test", role: "owner" },
  { name: "Adam Admin", email: "admin@acme.test", role: "admin" },
  { name: "Maya Member", email: "maya@acme.test", role: "member" },
  { name: "Sam Member", email: "sam@acme.test", role: "member" },
] as const;

async function seed() {
  await db
    .insert(organizations)
    .values({ name: "Acme Inc.", slug: "acme" })
    .onConflictDoNothing({ target: organizations.slug });

  const [acme] = await db.select().from(organizations).where(eq(organizations.slug, "acme"));

  await db
    .insert(users)
    .values(
      demoMembers.map((m) => ({
        id: randomUUID(),
        name: m.name,
        email: m.email,
        emailVerified: true,
      })),
    )
    .onConflictDoNothing({ target: users.email });

  const savedUsers = await db
    .select()
    .from(users)
    .where(
      inArray(
        users.email,
        demoMembers.map((m) => m.email),
      ),
    );

  await db
    .insert(memberships)
    .values(
      demoMembers.map((m) => {
        const user = savedUsers.find((u) => u.email === m.email);
        if (!user) {
          throw new Error(`Seed user ${m.email} was not saved.`);
        }
        return { organizationId: acme.id, userId: user.id, role: m.role };
      }),
    )
    .onConflictDoNothing({ target: [memberships.organizationId, memberships.userId] });

  // Demo data for the example Projects page. Only added once.
  if ((await db.$count(projects, eq(projects.organizationId, acme.id))) === 0) {
    await db.insert(projects).values([
      { organizationId: acme.id, name: "Website redesign", description: "New landing page." },
      { organizationId: acme.id, name: "Mobile app", description: "iOS and Android." },
    ]);
  }

  console.log(`Seeded ${acme.name} with ${demoMembers.length} members and demo projects.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(closeDb);
