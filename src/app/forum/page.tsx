import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forum",
  description: "Placeholder description for forum page",
};
import { listForumCategories, ensureDefaultForumCategories } from "@/server/db/queries";
import { Suspense } from "react";
import Link from "next/link";
import { CategorySidebar } from "./_components/CategorySidebar";
import { ForumSearch } from "./_components/ForumSearch";
import { ForumPostsList } from "./_components/ForumPostsList";
import { ForumPostsSkeleton } from "./_components/ForumPostsSkeleton";

export const dynamic = "force-dynamic";

export default async function ForumPage({ searchParams }: { searchParams: { q?: string; sort?: string } }) {
  await ensureDefaultForumCategories();
  const categories = await listForumCategories();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Community Forum</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-80">
            <ForumSearch />
          </div>
          <Link href="/forum/new" className="bg-slate-900 text-white text-sm font-medium rounded-md px-4 py-2">New Post</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategorySidebar categories={categories} />
        </div>
        <div className="md:col-span-3 space-y-4">
          <Suspense fallback={<ForumPostsSkeleton />}>
            <ForumPostsList search={searchParams.q || undefined} sort={(searchParams.sort as any) || "recent"} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
