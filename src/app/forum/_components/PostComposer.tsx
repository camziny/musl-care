"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function PostComposer({ categories, createPost }: { categories: Array<{ id: number; name: string }>; createPost: (input: { categoryId: number; title: string; content: string; tags?: string[] }) => Promise<{ id: number }> }) {
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
    const post = await createPost({ categoryId: Number(categoryId), title, content, tags: tagArr });
    router.push(`/forum/p/${post.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="col-span-1 border border-border rounded-xl bg-background px-3 py-2 text-foreground" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input className="md:col-span-3 border border-border rounded-xl bg-background px-3 py-2 text-foreground" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <textarea className="w-full border border-border rounded-xl bg-background px-3 py-2 h-32 text-foreground placeholder:text-muted-foreground" placeholder="Share your question or experience" value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="flex items-center gap-3">
        <input className="flex-1 border border-border rounded-xl bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <Button disabled={loading} className="px-4 py-2 text-sm">{loading ? "Posting..." : "Post"}</Button>
      </div>
    </form>
  );
}
