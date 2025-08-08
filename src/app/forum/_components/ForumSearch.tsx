"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

export function ForumSearch({ placeholder = "Search posts" }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(() => searchParams.get("q") || "");

  useEffect(() => {
    const handle = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      const nextQ = value.trim();
      if (nextQ === currentQ) return;
      const params = new URLSearchParams(searchParams.toString());
      if (nextQ.length > 0) {
        params.set("q", nextQ);
      } else {
        params.delete("q");
      }
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pathname, router, searchParams]);

  const showClear = useMemo(() => value.length > 0, [value]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card/70 backdrop-blur-sm px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          aria-label="Search forum posts"
          className="flex-1 outline-none text-sm text-foreground placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {showClear && !isPending && (
          <button
            type="button"
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setValue("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

