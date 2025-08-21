"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = Math.max(1, parseInt(params?.get("page") || "1", 10));

  function setPage(next: number) {
    const sp = new URLSearchParams(params?.toString());
    sp.set("page", String(next));
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page <= 1}>Prev</Button>
      <Button variant={page === 1 ? "default" : "outline"} onClick={() => setPage(1)}>1</Button>
      {totalPages > 7 && page > 3 ? <span className="px-1 text-sm">…</span> : null}
      {(() => {
        const buttons: JSX.Element[] = [];
        const start = totalPages <= 7 ? 2 : Math.max(2, page - 1);
        const end = totalPages <= 7 ? totalPages - 1 : Math.min(totalPages - 1, page + 1);
        for (let n = start; n <= end; n++) {
          buttons.push(
            <Button key={n} variant={n === page ? "default" : "outline"} onClick={() => setPage(n)}>
              {n}
            </Button>
          );
        }
        return buttons;
      })()}
      {totalPages > 7 && page < totalPages - 2 ? <span className="px-1 text-sm">…</span> : null}
      {totalPages > 1 ? (
        <Button variant={page === totalPages ? "default" : "outline"} onClick={() => setPage(totalPages)}>{totalPages}</Button>
      ) : null}
      <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</Button>
    </div>
  );
}


