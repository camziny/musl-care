"use client";
import { toast } from "sonner";

export function LikeClientButton({ count }: { count?: number }) {
  const display = typeof count === "number" && count > 0 ? ` ${count}` : "";
  return (
    <button
      className="text-xs text-muted-foreground hover:text-foreground"
      onClick={() => {
        toast.success("Liked");
      }}
    >
      {`Like${display}`}
    </button>
  );
}

