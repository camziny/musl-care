"use client";
import { useState } from "react";
import { toast } from "sonner";

export function ClientCommentForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [value, setValue] = useState("");
  return (
    <form action={action} className="space-y-2" onSubmit={() => { setValue(""); toast.success("Comment posted"); }}>
      <textarea name="content" value={value} onChange={(e) => setValue(e.target.value)} className="w-full border rounded px-3 py-2 h-24" placeholder="Write a comment" />
      <button className="bg-slate-800 text-white text-xs rounded px-3 py-1">Comment</button>
    </form>
  );
}

