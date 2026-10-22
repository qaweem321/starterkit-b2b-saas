// Must come first: the database connection reads DATABASE_URL when it is imported.
import "./load-env";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq, inArray, notInArray } from "drizzle-orm";
import { closeDb, db } from "./index";
import { accounts, memberships, organizations, projects, users } from "./schema";

// The password every demo member logs in with (see the README's quick start).
const demoPassword = "kit-demo";

const demoMembers = [
  { name: "Olivia Owner", email: "owner@acme.test", role: "owner" },
  { name: "Adam Admin", email: "admin@acme.test", role: "admin" },
  { name: "Maya Member", email: "maya@acme.test", role: "member" },
  { name: "Sam Member", email: "sam@acme.test", role: "member" },
] as const;

// The demo logins have a published password, so never add them to a real installation:
// only to a fresh database (no other accounts yet).
async function refuseRealInstall() {
  const others = await db.$count(
    users,
    notInArray(
      users.email,
      demoMembers.map((member) => member.email),
    ),
  );
  if (others > 0) {
    throw new Error(
      "This database already has real accounts. The demo data adds logins with a published password, so it only runs on a fresh database.",
    );
  }
}

async function seed() {
  await refuseRealInstall();
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

  // Password logins for the demo members, so the dashboard can be tried right away.
  const passwordHash = await hashPassword(demoPassword);
  await db
    .insert(accounts)
    .values(
      savedUsers.map((user) => ({
        id: `seed-${user.id}`,
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: passwordHash,
      })),
    )
    .onConflictDoNothing({ target: accounts.id });

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
