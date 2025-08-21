export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="aspect-[16/9] w-full rounded-md bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}


