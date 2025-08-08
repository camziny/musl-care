"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function ClientCommentForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [value, setValue] = useState("");
  return (
    <form action={action} className="space-y-2" onSubmit={() => { setValue(""); toast.success("Comment posted"); }}>
      <textarea name="content" value={value} onChange={(e) => setValue(e.target.value)} className="w-full border border-border rounded-xl bg-background px-3 py-2 h-24 text-foreground placeholder:text-muted-foreground" placeholder="Write a comment" />
      <Button className="text-xs px-3 py-1">Comment</Button>
    </form>
  );
}

