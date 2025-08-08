import { PostCardSkeleton } from "./PostCardSkeleton";

export function ForumPostsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

