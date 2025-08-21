"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCategoryPlaceholder } from "./placeholders";

export default function BusinessCard({
  slug,
  name,
  category,
  city,
  state,
  imageUrl,
}: {
  slug: string;
  name: string;
  category: string;
  city?: string | null;
  state?: string | null;
  imageUrl?: string | null;
}) {
  return (
    <Link href={`/businesses/${slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition rounded-2xl">
        <div className="aspect-[16/9] w-full overflow-hidden bg-gray-50">
          {imageUrl ? (
            <SafeImage src={imageUrl} alt={name} width={800} height={450} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <SafeImage src={getCategoryPlaceholder(category)} alt={name} width={80} height={80} className="h-20 w-20 object-contain opacity-70" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-1.5">
          <Badge>{category}</Badge>
          <div className="font-medium text-base">{name}</div>
          <div className="text-sm text-muted-foreground">{[city, state].filter(Boolean).join(", ")}</div>
        </CardContent>
      </Card>
    </Link>
  );
}


