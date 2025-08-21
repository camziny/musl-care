import BusinessSearch from "./_components/BusinessSearch";
import BusinessFilters from "./_components/BusinessFilters";
import Results from "./_components/Results";
import ListGridToggle from "./_components/ListGridToggle";
import CategoryPills from "./_components/CategoryPills";
import MobileFiltersDrawer from "./_components/MobileFiltersDrawer";

export const dynamic = "force-dynamic";

export default async function BusinessesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = {
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    category: typeof searchParams.category === "string" ? (searchParams.category as any) : undefined,
    city: typeof searchParams.city === "string" ? searchParams.city : undefined,
    state: typeof searchParams.state === "string" ? searchParams.state : undefined,
    isMuslimOwned: searchParams.isMuslimOwned === "true" ? true : searchParams.isMuslimOwned === "false" ? false : undefined,
    isArabOwned: searchParams.isArabOwned === "true" ? true : searchParams.isArabOwned === "false" ? false : undefined,
    isSouthAsianOwned: searchParams.isSouthAsianOwned === "true" ? true : searchParams.isSouthAsianOwned === "false" ? false : undefined,
    sort: typeof searchParams.sort === "string" ? (searchParams.sort as any) : undefined,
    page: typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1,
    pageSize: 12,
  };

  const view = (typeof searchParams.view === "string" ? searchParams.view : "grid") as "grid" | "list";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Community Business Directory</h1>
      </div>
      <div className="rounded-2xl border border-border bg-background px-4 py-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-3">
            <BusinessSearch />
          </div>
          <div className="hidden md:flex md:col-span-1 items-center md:justify-end">
            <ListGridToggle />
          </div>
        </div>
        <div className="md:hidden flex items-center justify-between">
          <MobileFiltersDrawer />
        </div>
        <CategoryPills />
      </div>
      
      <div className="hidden md:block">
        <BusinessFilters />
      </div>
      <Results params={params} view={view} />
    </div>
  );
}


