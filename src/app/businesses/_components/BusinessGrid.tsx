"use client";
import BusinessCard from "./BusinessCard";

export default function BusinessGrid({ items }: { items: Array<{ slug: string; name: string; category: string; city?: string | null; state?: string | null; imageUrl?: string | null; }>; }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <BusinessCard key={b.slug} {...b} />
      ))}
    </div>
  );
}


