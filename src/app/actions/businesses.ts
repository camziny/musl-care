"use server";

import { auth } from "@clerk/nextjs/server";
import { db, businesses, users } from "@/server/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { businessCreateSchema, businessUpdateSchema, type BusinessCreateInput, type BusinessListQuery } from "@/types/businesses";
import { requireRole } from "./userChecks";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createBusiness(input: BusinessCreateInput) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const gate = await requireRole(["premium", "lux", "admin"]);
  if (!gate.ok) throw new Error(gate.reason === "forbidden" ? "Forbidden" : "Unauthorized");

  const payload = await businessCreateSchema.validate(input, { abortEarly: false, stripUnknown: true });

  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");

  const baseSlug = toSlug(payload.name);
  let slug = baseSlug;
  let counter = 1;
  // ensure unique slug
  while (await db.query.businesses.findFirst({ where: (m, { eq }) => eq(m.slug, slug) })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const [row] = await db
    .insert(businesses)
    .values({
      slug,
      name: payload.name,
      ownerName: payload.ownerName ?? null,
      category: payload.category as any,
      description: payload.description ?? null,
      addressLine: payload.addressLine ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      zip: payload.zip ?? null,
      country: payload.country ?? undefined,
      website: payload.website ?? null,
      contactEmail: payload.contactEmail ?? null,
      contactPhone: payload.contactPhone ?? null,
      socialLinks: payload.socialLinks ?? {},
      imageKey: payload.imageKey ?? null,
      imageUrl: payload.imageUrl ?? null,
      isMuslimOwned: payload.isMuslimOwned ?? false,
      isArabOwned: payload.isArabOwned ?? false,
      isSouthAsianOwned: payload.isSouthAsianOwned ?? false,
      createdByUserId: dbUser.id,
    })
    .returning();

  return row;
}

export async function updateBusiness(slug: string, input: any) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");

  const existing = await db.query.businesses.findFirst({ where: (m, { eq }) => eq(m.slug, slug) });
  if (!existing) throw new Error("Not found");
  const isOwner = existing.createdByUserId === dbUser.id;
  const gate = await requireRole(["admin"]);
  const isAdmin = gate.ok;
  if (!isOwner && !isAdmin) throw new Error("Forbidden");

  const payload = await businessUpdateSchema.validate(input, { abortEarly: false, stripUnknown: true });

  await db
    .update(businesses)
    .set({
      ...payload,
    } as any)
    .where(eq(businesses.slug, slug));
}

export async function adminSetBusinessStatus(slug: string, status: "approved" | "rejected", note?: string) {
  const gate = await requireRole(["admin"]);
  if (!gate.ok) throw new Error("Forbidden");
  await db
    .update(businesses)
    .set({ status: status as any, reviewNote: note ?? null, publishedAt: status === "approved" ? new Date() : null as any })
    .where(eq(businesses.slug, slug));
}

export async function incrementBusinessViews(slug: string) {
  await db.execute(sql`UPDATE ${businesses} SET views_count = views_count + 1 WHERE ${businesses.slug} = ${slug}`);
}

export async function searchBusinesses(params: BusinessListQuery) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));
  const offset = (page - 1) * pageSize;

  const clauses: any[] = [eq(businesses.status, "approved")];
  if (params.q) clauses.push(or(ilike(businesses.name, `%${params.q}%`), ilike(businesses.description, `%${params.q}%`)));
  if (params.category && params.category !== "all") clauses.push(eq(businesses.category, params.category as any));
  if (params.city) clauses.push(ilike(businesses.city, `%${params.city}%`));
  if (params.state) clauses.push(ilike(businesses.state, `%${params.state}%`));
  if (typeof params.isMuslimOwned === "boolean") clauses.push(eq(businesses.isMuslimOwned, params.isMuslimOwned));
  if (typeof params.isArabOwned === "boolean") clauses.push(eq(businesses.isArabOwned, params.isArabOwned));
  if (typeof params.isSouthAsianOwned === "boolean") clauses.push(eq(businesses.isSouthAsianOwned, params.isSouthAsianOwned));
  const whereExpr = clauses.length ? and(...clauses) : undefined as any;

  const rows = await db.query.businesses.findMany({
    where: () => whereExpr,
    orderBy: (m, o) =>
      params.sort === "alphabetical"
        ? o.asc(m.name)
        : params.sort === "most_viewed"
        ? o.desc(m.viewsCount)
        : o.desc(m.publishedAt),
    limit: pageSize,
    offset,
  });

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(businesses)
    .where(whereExpr);

  const total = (count as unknown as number) || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items: rows, total, totalPages };
}


