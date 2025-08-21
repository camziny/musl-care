"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function BusinessList({ items }: { items: Array<{ slug: string; name: string; category: string; city?: string | null; state?: string | null; }>; }) {
  return (
    <div className="space-y-3">
      {items.map((b) => (
        <Link key={b.slug} href={`/businesses/${b.slug}`} className="block rounded-xl border bg-card hover:shadow-md transition">
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="font-medium text-base">{b.name}</div>
                <Badge>{b.category}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{[b.city, b.state].filter(Boolean).join(", ")}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}


