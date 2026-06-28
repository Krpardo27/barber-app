type AdminTableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export default function AdminTableSkeleton({
  rows = 8,
  columns = 6,
}: AdminTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-white/5 px-6 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
      </div>
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 px-6 py-4 md:grid-cols-[repeat(var(--columns),minmax(0,1fr))]"
            style={{ "--columns": columns } as React.CSSProperties}
          >
            {Array.from({ length: columns }).map((__, columnIndex) => (
              <div
                key={columnIndex}
                className="h-4 animate-pulse rounded bg-white/10"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}