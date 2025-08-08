import { listForumCategories, createForumPost } from "@/server/db/queries";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const categories = await listForumCategories();

  async function submit(formData: FormData) {
    "use server";
    const categoryId = Number(formData.get("categoryId"));
    const title = String(formData.get("title") || "");
    const content = String(formData.get("content") || "");
    const tagsRaw = String(formData.get("tags") || "");
    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    const post = await createForumPost({ categoryId, title, content, tags });
    redirect(`/forum/p/${post.id}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Create Post</h1>
      <form action={submit} className="space-y-4">
        <select name="categoryId" className="w-full border rounded px-3 py-2" defaultValue="">
          <option value="" disabled>Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="title" className="w-full border rounded px-3 py-2" placeholder="Title" />
        <textarea name="content" className="w-full border rounded px-3 py-2 h-48" placeholder="Share your question or experience" />
        <input name="tags" className="w-full border rounded px-3 py-2" placeholder="Tags (comma separated)" />
        <Button className="rounded-full px-4 py-2 text-sm">Post</Button>
      </form>
    </div>
  );
}
