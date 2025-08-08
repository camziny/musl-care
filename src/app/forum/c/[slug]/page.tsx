import { listForumCategories } from "@/server/db/queries";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs/server";
import { CategorySidebar } from "../../_components/CategorySidebar";
import { ForumSearch } from "../../_components/ForumSearch";
import { ForumPostsList } from "../../_components/ForumPostsList";
import { ForumPostsSkeleton } from "../../_components/ForumPostsSkeleton";

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { q?: string; sort?: string; tag?: string } }) {
  const categories = await listForumCategories();
  const category = categories.find(c => c.slug === params.slug);
  if (!category) return <div className="container mx-auto px-4 py-8">Not found</div>;
  const { userId } = auth();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{category.name}</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-80">
            <ForumSearch />
          </div>
          <Link href="/forum/new"><Button className="text-sm">New Post</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategorySidebar categories={categories} activeSlug={category.slug} />
        </div>
        <div className="md:col-span-3 space-y-4">
          {!userId && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-slate-700">Sign in to start a new post. <a href="/sign-in" className="underline">Sign in</a></div>
          )}
          <Suspense fallback={<ForumPostsSkeleton />}>
            <ForumPostsList categoryId={category.id} categoryName={category.name} search={searchParams.q || undefined} sort={(searchParams.sort as any) || "recent"} tag={searchParams.tag || undefined} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
