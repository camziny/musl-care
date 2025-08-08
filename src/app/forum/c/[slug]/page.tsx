import { listForumCategories, listForumPosts, getUsersPublic } from "@/server/db/queries";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CategorySidebar } from "../../_components/CategorySidebar";
import { PostCard } from "../../_components/PostCard";

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { q?: string; sort?: string; tag?: string } }) {
  const categories = await listForumCategories();
  const category = categories.find(c => c.slug === params.slug);
  if (!category) return <div className="container mx-auto px-4 py-8">Not found</div>;
  const posts = await listForumPosts({ categoryId: category.id, search: searchParams.q || undefined, sort: (searchParams.sort as any) || "recent", tag: searchParams.tag || undefined });
  const authorIds = Array.from(new Set(posts.map(p => p.authorUserId)));
  const authors = await getUsersPublic(authorIds);
  const authorById = new Map(authors.map(a => [a.id, a]));
  const { userId } = auth();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{category.name}</h1>
        <Link href="/forum/new" className="bg-slate-900 text-white text-sm font-medium rounded-md px-4 py-2">New Post</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategorySidebar categories={categories} activeSlug={category.slug} />
        </div>
        <div className="md:col-span-3 space-y-4">
          {!userId && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-slate-700">Sign in to start a new post. <a href="/sign-in" className="underline">Sign in</a></div>
          )}
          {posts.map((p) => (
            <PostCard
              key={p.id}
              id={p.id}
              title={p.title}
              excerpt={p.content}
              createdAt={p.createdAt.toString()}
              commentCount={p.commentCount}
              categoryName={category.name}
              author={authorById.get(p.authorUserId) || null}
              tags={p.tags as any}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
