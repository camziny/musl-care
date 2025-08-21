import { db } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { businesses } from "@/server/db/schema";
import SafeImage from "@/components/ui/SafeImage";
import { incrementBusinessViews } from "@/app/actions/businesses";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCategoryPlaceholder } from "../_components/placeholders";

export async function generateStaticParams() {
  return [];
}

export default async function BusinessProfile({ params }: { params: { slug: string } }) {
  const row = await db.query.businesses.findFirst({ where: (m, { eq }) => eq(m.slug, params.slug) });
  if (!row || row.status !== "approved") {
    return <div className="mx-auto max-w-4xl px-4 py-10">Not found</div>;
  }
  await incrementBusinessViews(params.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <Card className="overflow-hidden rounded-2xl">
        <div className="aspect-[16/9] w-full overflow-hidden bg-gray-50">
          {row.imageUrl ? (
            <SafeImage src={row.imageUrl} alt={row.name} width={1200} height={675} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <SafeImage src={getCategoryPlaceholder(row.category)} alt={row.name} width={96} height={96} className="h-24 w-24 object-contain opacity-70" />
            </div>
          )}
        </div>
        <CardContent className="space-y-3">
          <Badge>{row.category}</Badge>
          <h1 className="text-3xl font-semibold">{row.name}</h1>
          <div className="text-sm text-muted-foreground">{[row.city, row.state].filter(Boolean).join(", ")}</div>
          {row.description ? <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{row.description}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {row.website ? (
              <a className="text-primary underline" href={row.website} target="_blank" rel="noreferrer">Website</a>
            ) : null}
            {row.contactEmail ? (
              <a className="text-primary underline" href={`mailto:${row.contactEmail}`}>{row.contactEmail}</a>
            ) : null}
            {row.contactPhone ? <div>{row.contactPhone}</div> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


