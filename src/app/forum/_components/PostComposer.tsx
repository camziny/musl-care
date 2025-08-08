"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createForumPost } from "@/app/actions/forum";

export function PostComposer({ categories }: { categories: Array<{ id: number; name: string }> }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<number | "">(categories[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !title.trim() || !content.trim()) return;
    setLoading(true);
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const post = await createForumPost({ categoryId: Number(categoryId), title, content, tags: tagArr });
    router.push(`/forum/p/${post.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="col-span-1 border rounded-md px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input className="md:col-span-3 border rounded-md px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <textarea className="w-full border rounded-md px-3 py-2 h-32" placeholder="Share your question or experience" value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="flex items-center gap-3">
        <input className="flex-1 border rounded-md px-3 py-2" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button disabled={loading} className="bg-slate-900 text-white rounded-md px-4 py-2 text-sm">{loading ? "Posting..." : "Post"}</button>
      </div>
    </form>
  );
}
