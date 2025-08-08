import { getCaregivers } from "@/server/db/queries";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function CareGiverList() {
  const careGivers = await getCaregivers();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {careGivers.map((careGiver) => {
          let imageUrl = "/default-profile.jpg";
          let altText = "Caregiver profile picture";

          try {
            const image = JSON.parse(careGiver.image);
            imageUrl = image.url || imageUrl;
            altText = image.altText || altText;
          } catch (error) {
            imageUrl = careGiver.image;
          }

          return (
            <div key={careGiver.id} className="group rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden hover:shadow-md transition-all">
              <Link href={`/caregivers/${careGiver.id}`} className="block">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    quality={75}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted" />
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-foreground truncate">{careGiver.name}</h2>
                      <div className="text-xs text-muted-foreground truncate">{careGiver.city}, {careGiver.state}</div>
                    </div>
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">Verified</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{careGiver.description}</p>
                  <div className="mt-3">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
