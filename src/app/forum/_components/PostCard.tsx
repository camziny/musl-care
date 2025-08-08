import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

type Author = { id: number; publicName: string | null; locationCity: string | null; locationState: string | null };

export function PostCard({
  id,
  title,
  excerpt,
  createdAt,
  commentCount,
  categoryName,
  author,
  tags,
}: {
  id: number;
  title: string;
  excerpt: string;
  createdAt: string;
  commentCount: number;
  categoryName?: string;
  author?: Author | null;
  tags?: string[];
}) {
  return (
    <Link href={`/forum/p/${id}`} className="block rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition group bg-white">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar name={author?.publicName} />
            <div className="text-xs text-slate-600">
              <div className="font-medium text-slate-800">{author?.publicName ?? "Anonymous"}</div>
              <div className="flex items-center gap-2">
                {categoryName && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{categoryName}</span>}
                <span className="text-slate-400">•</span>
                <span>{new Date(createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          {tags && tags.length > 0 && (
            <div className="hidden md:flex gap-2">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">#{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="text-xl font-semibold text-slate-900 group-hover:text-slate-800 mb-1 tracking-tight">{title}</div>
        <div className="text-slate-600 line-clamp-2 mb-3">{excerpt}</div>
        <div className="flex items-center justify-end text-xs text-slate-500">
          <span className="rounded-full bg-slate-50 px-2 py-1">{commentCount} comments</span>
        </div>
      </div>
    </Link>
  );
}
