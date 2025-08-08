import { listForumPosts, getUsersPublic } from "@/server/db/queries";
import { PostCard } from "./PostCard";

export async function ForumPostsList({
  categoryId,
  search,
  sort,
  tag,
  categoryName,
}: {
  categoryId?: number;
  search?: string;
  sort?: "recent" | "trending";
  tag?: string;
  categoryName?: string;
}) {
  const posts = await listForumPosts({ categoryId, search, sort, tag });
  const authorIds = Array.from(new Set(posts.map((p) => p.authorUserId)));
  const authors = await getUsersPublic(authorIds);
  const authorById = new Map(authors.map((a) => [a.id, a]));
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/70 backdrop-blur-sm p-8 text-center text-muted-foreground">
        No posts found
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard
          key={p.id}
          id={p.id}
          title={p.title}
          excerpt={p.content}
          createdAt={p.createdAt.toString()}
          likeCount={p.likeCount}
          commentCount={p.commentCount}
          categoryName={categoryName}
          author={authorById.get(p.authorUserId) || null}
          tags={p.tags as any}
        />
      ))}
    </div>
  );
}

