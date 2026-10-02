import { db } from "./index";
import { organizations } from "./schema";

async function seed() {
  const inserted = await db
    .insert(organizations)
    .values({ name: "Acme Inc.", slug: "acme" })
    .onConflictDoNothing({ target: organizations.slug })
    .returning();

  if (inserted.length > 0) {
    console.log("Created organization:", inserted[0]);
  } else {
    console.log("Organization 'acme' already exists, nothing to do.");
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
