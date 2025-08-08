import Link from "next/link";

export function CategorySidebar({
  categories,
  activeSlug,
}: {
  categories: Array<{ id: number; name: string; slug: string }>;
  activeSlug?: string;
}) {
  return (
    <aside className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
      <div className="text-sm font-semibold text-foreground px-1">Categories</div>
      <nav className="mt-2 space-y-1.5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/forum/c/${c.slug}`}
            className={`block rounded-lg px-3 py-2 text-sm ${activeSlug === c.slug ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/10"}`}
          >
            {c.name}
          </Link>
        ))}
        <Link href="/forum" className={`block rounded-lg px-3 py-2 text-sm ${!activeSlug ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/10"}`}>All</Link>
      </nav>
    </aside>
  );
}
