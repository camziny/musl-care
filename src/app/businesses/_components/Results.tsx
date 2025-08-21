import { searchBusinesses } from "@/app/actions/businesses";
import BusinessGrid from "./BusinessGrid";
import BusinessList from "./BusinessList";
import Pagination from "./Pagination";

export default async function Results({
  params,
  view,
}: {
  params: any;
  view: "grid" | "list";
}) {
  const { items, totalPages } = await searchBusinesses(params);
  if (items.length === 0) {
    return (
      <div className="rounded-md border bg-gray-50 p-6 text-sm text-gray-600">No businesses found. Try adjusting your filters.</div>
    );
  }
  return (
    <>
      {view === "grid" ? <BusinessGrid items={items as any} /> : <BusinessList items={items as any} />} 
      <Pagination totalPages={totalPages} />
    </>
  );
}


