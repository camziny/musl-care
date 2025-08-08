import { getForumPost, listForumComments, getUsersPublic } from "@/server/db/queries";
import { addForumComment, toggleLikeComment, sendDirectMessage, reportContent } from "@/app/actions/forum";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function CommentForm({ postId, parentCommentId }: { postId: number; parentCommentId?: number | null }) {
  async function submit(formData: FormData) {
    "use server";
    const content = String(formData.get("content") || "");
    await addForumComment({ postId, parentCommentId: parentCommentId ?? null, content });
    revalidatePath(`/forum/p/${postId}`);
  }
  return (
    <ClientCommentForm action={submit} />
  );
}

function ClientCommentForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  "use client";
  const [value, setValue] = require("react").useState("");
  const { toast } = require("sonner");
  return (
    <form
      action={async (fd: FormData) => {
        await action(fd);
        setValue("");
        toast.success("Comment posted");
      }}
      className="space-y-2"
    >
      <textarea name="content" value={value} onChange={(e: any) => setValue(e.target.value)} className="w-full border rounded px-3 py-2 h-24" placeholder="Write a comment" />
      <button className="bg-slate-800 text-white text-xs rounded px-3 py-1">Comment</button>
    </form>
  );
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = await getForumPost(postId);
  const comments = await listForumComments(postId);
  const authorIds = Array.from(new Set([post.authorUserId, ...comments.map(c => c.authorUserId)]));
  const authors = await getUsersPublic(authorIds);
  const authorById = new Map(authors.map(a => [a.id, a]));
  const { userId } = auth();
  async function like(formData: FormData) {
    "use server";
    const commentId = Number(formData.get("commentId"));
    await toggleLikeComment(commentId);
    revalidatePath(`/forum/p/${postId}`);
  }
  async function messageAuthor(formData: FormData) {
    "use server";
    const recipient = Number(formData.get("recipient"));
    const content = String(formData.get("content") || "");
    await sendDirectMessage(recipient, content);
  }
  async function reportPost(formData: FormData) {
    "use server";
    const reason = String(formData.get("reason") || "");
    await reportContent({ targetType: "post", postId, reason });
  }
  async function reportComment(formData: FormData) {
    "use server";
    const commentId = Number(formData.get("commentId"));
    const reason = String(formData.get("reason") || "");
    await reportContent({ targetType: "comment", commentId, reason });
    revalidatePath(`/forum/p/${postId}`);
  }

  const byParent: Record<string, typeof comments> = {};
  for (const c of comments) {
    const key = String(c.parentCommentId ?? 0);
    if (!byParent[key]) byParent[key] = [] as any;
    byParent[key].push(c);
  }
  function renderThread(parentId: number | null, depth: number): JSX.Element[] {
    const key = String(parentId ?? 0);
    const arr = byParent[key] || [];
    return arr.map(c => (
      <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-3 mt-3" style={{ marginLeft: depth * 16 }}>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">{authorById.get(c.authorUserId)?.publicName ?? "User"}</span>
            <span>•</span>
            <span>{c.createdAt.toString()}</span>
          </div>
        </div>
        <div className="whitespace-pre-wrap mt-2 text-slate-800">{c.content}</div>
        <div className="flex items-center gap-3 mt-2">
          <form action={async (fd) => { await like(fd); }}>
            <input type="hidden" name="commentId" value={c.id} />
            <LikeClientButton />
          </form>
          <details>
            <summary className="text-xs text-slate-600 cursor-pointer">Report</summary>
            <form action={reportComment} className="mt-2 space-y-2">
              <input type="hidden" name="commentId" value={c.id} />
              <input name="reason" className="w-full border rounded px-3 py-2" placeholder="Reason" />
              <button className="text-xs bg-red-600 text-white rounded px-2 py-1">Submit</button>
            </form>
          </details>
        </div>
        <div className="mt-3 ml-4">
          <CommentForm postId={postId} parentCommentId={c.id} />
        </div>
        {renderThread(c.id, depth + 1)}
      </div>
    ));
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-semibold w-10 h-10">
            <span className="text-xs">{(authorById.get(post.authorUserId)?.publicName || "U").slice(0,2).toUpperCase()}</span>
          </div>
          <div className="text-xs text-slate-600">
            <div className="font-medium text-slate-800">{authorById.get(post.authorUserId)?.publicName ?? "User"}</div>
            <div>{post.createdAt.toString()}</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-3 mb-2 text-slate-900 tracking-tight">{post.title}</h1>
        <div className="prose max-w-none whitespace-pre-wrap text-slate-800">{post.content}</div>
        {userId && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-slate-600">Message author</summary>
            <form action={messageAuthor} className="mt-2 space-y-2">
              <input type="hidden" name="recipient" value={post.authorUserId} />
              <textarea name="content" className="w-full border rounded px-3 py-2 h-24" placeholder="Write a private message" />
              <button className="bg-slate-800 text-white text-xs rounded px-3 py-1">Send</button>
            </form>
          </details>
        )}
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-slate-600">Report post</summary>
          <form action={reportPost} className="mt-2 space-y-2">
            <input name="reason" className="w-full border rounded px-3 py-2" placeholder="Reason" />
            <button className="text-xs bg-red-600 text-white rounded px-2 py-1">Submit</button>
          </form>
        </details>
      </div>
      <div className="space-y-6">
        {userId ? (
          <CommentForm postId={postId} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-slate-700">Sign in to join the discussion. <a href="/sign-in" className="underline">Sign in</a></div>
        )}
        {renderThread(null, 0)}
      </div>
    </div>
  );
}

function LikeClientButton() {
  "use client";
  const { toast } = require("sonner");
  return (
    <button
      className="text-xs text-slate-600 hover:text-slate-800"
      onClick={() => {
        toast.success("Liked");
      }}
    >
      Like
    </button>
  );
}
