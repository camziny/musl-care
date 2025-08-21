import "dotenv/config";
import { db, businesses, users } from "@/server/db/schema";
import { sql, ilike, eq } from "drizzle-orm";

const categories = [
  "Daycare",
  "Tutoring",
  "Senior recreation",
  "Products",
  "Clothing & Accessories",
  "Catering",
  "Food/restaurant",
  "Umrah/Hajj booking",
  "Legal services",
  "Therapists",
] as const;

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const cities = [
  ["Dearborn", "MI"],
  ["Paterson", "NJ"],
  ["Houston", "TX"],
  ["Chicago", "IL"],
  ["Edison", "NJ"],
  ["Brooklyn", "NY"],
  ["Fremont", "CA"],
  ["Sterling", "VA"],
  ["Plano", "TX"],
  ["San Jose", "CA"],
] as const;

const adjectives = ["Crescent", "Noor", "Barakah", "Rahma", "Amal", "Safa", "Safa & Marwa", "Unity", "Atlas", "Oasis"];
const nouns = ["Care", "Tutoring", "Daycare", "Catering", "Bakery", "Clinic", "Therapy", "Legal", "Travel", "Boutique", "Foods", "Services"];

async function ensureExampleUser() {
  const clerkId = "seed-user";
  let user = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkId) });
  if (!user) {
    const [u] = await db.insert(users).values({ clerkUserId: clerkId }).returning();
    user = u;
  }
  return user;
}

async function main() {
  const user = await ensureExampleUser();
  const count = 60;
  for (let i = 0; i < count; i++) {
    const name = `${pick(adjectives)} ${pick(nouns)}`;
    const baseSlug = toSlug(name);
    let slug = baseSlug;
    let n = 1;
    while (await db.query.businesses.findFirst({ where: (m, { eq }) => eq(m.slug, slug) })) {
      slug = `${baseSlug}-${n++}`;
    }
    const [city, state] = pick(cities);
    const category = pick(categories);
    await db.insert(businesses).values({
      slug,
      name,
      ownerName: "Seed Owner",
      category: category as any,
      description: `${name} provides high-quality ${category.toLowerCase()} services to the community. Our mission is to serve families with excellence and compassion.`,
      city,
      state,
      website: "https://example.com",
      imageUrl: "/default-care-icon.svg",
      contactEmail: `contact+${slug}@example.com`,
      isMuslimOwned: Math.random() > 0.3,
      isArabOwned: Math.random() > 0.5,
      isSouthAsianOwned: Math.random() > 0.5,
      status: Math.random() > 0.15 ? ("approved" as any) : ("pending" as any),
      publishedAt: new Date(),
      createdByUserId: user.id,
      viewsCount: Math.floor(Math.random() * 500),
    });
  }
  console.log(`Seeded ${count} businesses.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });


