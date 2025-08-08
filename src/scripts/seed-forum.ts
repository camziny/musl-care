import * as dotenv from "dotenv";
dotenv.config();

import { db, users, forumCategories, forumPosts, forumComments, commentLikes, contentReports } from "@/server/db/schema";
import { eq } from "drizzle-orm";

async function getOrCreateUser(clerkUserId: string, publicName: string, city?: string, state?: string) {
  let user = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (user) return user;
  const [created] = await db.insert(users).values({
    clerkUserId,
    publicName,
    locationCity: city ?? null as any,
    locationState: state ?? null as any,
  }).returning();
  return created;
}

async function ensureCategories() {
  const defaults = [
    { slug: "parenting", name: "Parenting", description: "Discussions for parents" },
    { slug: "elder-care", name: "Elder care", description: "Caring for elders" },
    { slug: "special-needs", name: "Special needs" },
    { slug: "pregnancy-postpartum", name: "Pregnancy/Postpartum" },
    { slug: "first-time-caregivers", name: "First-time caregivers" },
    { slug: "culture-specific", name: "Culture-specific threads" },
    { slug: "general", name: "General advice" },
    { slug: "off-topic", name: "Off-topic" },
  ];
  const existing = await db.query.forumCategories.findMany();
  if (existing.length > 0) return existing;
  await db.insert(forumCategories).values(defaults);
  return await db.query.forumCategories.findMany();
}

async function getCategoryBySlug(slug: string) {
  const all = await db.query.forumCategories.findMany();
  const found = all.find(c => c.slug === slug);
  if (!found) throw new Error(`Category not found for slug: ${slug}`);
  return found;
}

async function ensurePost(categoryId: number, authorUserId: number, title: string, content: string, tags: string[] = []) {
  const existing = await db.query.forumPosts.findFirst({ where: (m, { and, eq }) => and(eq(m.title, title), eq(m.categoryId, categoryId)) });
  if (existing) return existing;
  const [post] = await db.insert(forumPosts).values({ categoryId, authorUserId, title, content, tags }).returning();
  return post;
}

async function main() {
  console.log("Seeding forum data...");

  const catList = await ensureCategories();
  console.log(`Categories ensured: ${catList.length}`);

  const userSeeds = [
    { id: "seed_user_1", name: "Aisha", city: "Chicago", state: "IL" },
    { id: "seed_user_2", name: "Omar", city: "Houston", state: "TX" },
    { id: "seed_user_3", name: "Sara", city: "Detroit", state: "MI" },
    { id: "seed_user_4", name: "Yusuf", city: "Newark", state: "NJ" },
    { id: "seed_user_5", name: "Layla", city: "Irvine", state: "CA" },
    { id: "seed_user_6", name: "Zaid", city: "Dallas", state: "TX" },
    { id: "seed_user_7", name: "Mariam", city: "Atlanta", state: "GA" },
    { id: "seed_user_8", name: "Hassan", city: "Seattle", state: "WA" },
    { id: "seed_user_9", name: "Noor", city: "Brooklyn", state: "NY" },
    { id: "seed_user_10", name: "Khalid", city: "Phoenix", state: "AZ" },
    { id: "seed_user_11", name: "Fatima", city: "San Jose", state: "CA" },
    { id: "seed_user_12", name: "Ali", city: "Cleveland", state: "OH" },
  ];
  const usersList = [] as Array<{ id: number; clerkUserId: string; publicName: string }>;
  for (const u of userSeeds) {
    const created = await getOrCreateUser(u.id, u.name, u.city, u.state);
    usersList.push({ id: created.id, clerkUserId: created.clerkUserId, publicName: created.publicName || "" });
  }
  console.log(`Users ensured: ${usersList.length}`);

  const categories = await db.query.forumCategories.findMany();
  const titles = [
    "Looking for practical tips",
    "What would you do?",
    "Beginner questions",
    "Resources and recommendations",
    "Daily routine ideas",
    "How to handle setbacks",
    "Sharing our experience",
    "Cultural considerations",
    "Budget-friendly tips",
    "Time-saving approaches",
  ];
  const sampleBodies = [
    "Sharing what worked for us and looking for more ideas.",
    "Curious how others approach this in different situations.",
    "What pitfalls should we avoid when getting started?",
    "Please share helpful books, links, or videos.",
    "Trying to build a schedule that actually sticks.",
    "What strategies help when progress stalls?",
    "This is what we tried and how it went.",
    "How do you adapt practices for family and culture?",
    "Hoping for solutions that don't break the bank.",
    "Looking to streamline steps and save time.",
  ];
  const tagPool = ["advice", "halal", "routine", "safety", "budget", "mental-health", "sleep", "meals", "mobility", "education"]; 

  const createdPosts = [] as Array<{ id: number; categoryId: number }>;
  for (const cat of categories) {
    for (let i = 0; i < 6; i++) {
      const author = usersList[(cat.id + i) % usersList.length];
      const title = `${cat.slug} ${titles[i % titles.length]}`;
      const content = sampleBodies[i % sampleBodies.length];
      const tags = [tagPool[(i + cat.id) % tagPool.length], tagPool[(i * 2 + cat.id) % tagPool.length]];
      const post = await ensurePost(cat.id, author.id, title, content, tags);
      createdPosts.push({ id: post.id, categoryId: cat.id });
    }
  }

  for (const p of createdPosts) {
    const anyComment = await db.query.forumComments.findFirst({ where: (m, { eq }) => eq(m.postId, p.id) });
    if (anyComment) continue;
    for (let j = 0; j < 3; j++) {
      const author = usersList[(p.id + j) % usersList.length];
      const [parent] = await db.insert(forumComments).values({ postId: p.id, authorUserId: author.id, content: `Top-level comment ${j + 1}` }).returning();
      for (let k = 0; k < 2; k++) {
        const replier = usersList[(p.id + j + k + 1) % usersList.length];
        await db.insert(forumComments).values({ postId: p.id, authorUserId: replier.id, parentCommentId: parent.id, content: `Reply ${k + 1} to comment ${j + 1}` });
      }
    }
    const postComments = await db.query.forumComments.findMany({ where: (m, { eq }) => eq(m.postId, p.id) });
    await db.update(forumPosts).set({ commentCount: postComments.length }).where(eq(forumPosts.id, p.id));
  }

  const allComments = await db.query.forumComments.findMany();
  for (let i = 0; i < allComments.length; i++) {
    const c = allComments[i];
    const liker = usersList[(c.id + i) % usersList.length];
    const exists = await db.query.commentLikes.findFirst({ where: (m, { and, eq }) => and(eq(m.commentId, c.id), eq(m.userId, liker.id)) });
    if (!exists) {
      await db.insert(commentLikes).values({ commentId: c.id, userId: liker.id });
    }
  }
  const countsByComment = new Map<number, number>();
  const likesNow = await db.query.commentLikes.findMany();
  for (const l of likesNow) {
    countsByComment.set(l.commentId, (countsByComment.get(l.commentId) || 0) + 1);
  }
  for (const [commentId, cnt] of Array.from(countsByComment.entries())) {
    await db.update(forumComments).set({ likeCount: cnt }).where(eq(forumComments.id, commentId));
  }

  const existingReports = await db.query.contentReports.findMany();
  if (existingReports.length === 0) {
    const somePosts = createdPosts.slice(0, 4);
    for (let i = 0; i < somePosts.length; i++) {
      const reporter = usersList[(i + 2) % usersList.length];
      await db.insert(contentReports).values({ targetType: "post" as any, postId: somePosts[i].id, reporterUserId: reporter.id, reason: "Needs review" });
    }
    const someComments = allComments.slice(0, 6);
    for (let i = 0; i < someComments.length; i++) {
      const reporter = usersList[(i + 5) % usersList.length];
      await db.insert(contentReports).values({ targetType: "comment" as any, commentId: someComments[i].id, reporterUserId: reporter.id, reason: "Inappropriate" });
    }
  }

  console.log("Seeding complete");
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

