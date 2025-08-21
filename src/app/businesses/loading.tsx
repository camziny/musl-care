export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="h-8 w-96 rounded bg-gray-200 animate-pulse" />
      <div className="rounded-2xl border px-4 py-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="h-10 rounded-full bg-gray-200 animate-pulse md:col-span-3" />
          <div className="hidden md:block h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="md:hidden h-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border">
            <div className="aspect-[16/9] w-full bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


