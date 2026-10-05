import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { memberships, organizations, users } from "./schema";

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

  console.log(`Seeded ${acme.name} with ${demoMembers.length} members.`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
