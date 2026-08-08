export function FileCardSkeleton() {
  return (
    <div className="glass-panel p-4 flex flex-col gap-3">
      <div className="skeleton w-10 h-10 rounded-xl" />
      <div className="skeleton h-3.5 w-3/4 rounded" />
      <div className="skeleton h-2.5 w-1/2 rounded" />
    </div>
  );
}

export function FileRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="skeleton w-8 h-8 rounded-lg" />
      <div className="skeleton h-3.5 w-40 rounded" />
      <div className="skeleton h-3 w-16 rounded ml-auto" />
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="skeleton w-9 h-9 rounded-xl" />
      <div className="skeleton h-6 w-20 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}

export function GridSkeletonGroup({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FileCardSkeleton key={i} />
      ))}
    </div>
  );
}
