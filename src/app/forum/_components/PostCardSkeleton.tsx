export function PostCardSkeleton() {
  return (
    <div className="block rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-200 w-10 h-10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="h-5 w-14 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-14 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-slate-100 rounded mb-1 animate-pulse" />
      <div className="h-4 w-5/6 bg-slate-100 rounded mb-1 animate-pulse" />
      <div className="flex justify-end mt-3">
        <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

