import AdminTableSkeleton from "./AdminTableSkeleton";

type AdminHeadingSkeletonProps = {
  titleWidth?: string;
  subtitleWidth?: string;
  action?: "button" | "date";
};

export function AdminHeadingSkeleton({
  titleWidth = "w-40",
  subtitleWidth = "w-72",
  action,
}: AdminHeadingSkeletonProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className={`h-9 animate-pulse rounded bg-white/10 ${titleWidth}`} />
        <div
          className={`mt-3 h-4 animate-pulse rounded bg-white/10 ${subtitleWidth}`}
        />
      </div>

      {action === "button" && (
        <div className="h-10 w-full animate-pulse rounded-xl bg-white/10 sm:w-40" />
      )}

      {action === "date" && (
        <div className="h-16 rounded-2xl border border-white/10 bg-white/5 sm:w-72" />
      )}
    </div>
  );
}

export function AdminStatsSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-8 w-12 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminFilterSkeleton({ height = "h-20" }: { height?: string }) {
  return <div className={`${height} rounded-2xl border border-white/10 bg-white/5`} />;
}

export function AdminTablePageSkeleton({
  columns,
  filters = 1,
  rows = 8,
  titleWidth,
  subtitleWidth,
}: {
  columns: number;
  filters?: number;
  rows?: number;
  titleWidth?: string;
  subtitleWidth?: string;
}) {
  return (
    <div className="space-y-6">
      <AdminHeadingSkeleton titleWidth={titleWidth} subtitleWidth={subtitleWidth} />

      {Array.from({ length: filters }).map((_, index) => (
        <AdminFilterSkeleton key={index} height={index === 0 ? "h-20" : "h-24"} />
      ))}

      <AdminTableSkeleton rows={rows} columns={columns} />
    </div>
  );
}

export function AdminAgendaPageSkeleton() {
  return (
    <div className="space-y-6">
      <AdminHeadingSkeleton titleWidth="w-32" subtitleWidth="w-64" action="date" />
      <AdminStatsSkeleton cards={3} />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
            >
              <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
              <div className="space-y-3">
                <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-72 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-9 w-28 animate-pulse rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminServicesPageSkeleton() {
  return (
    <div className="space-y-6">
      <AdminHeadingSkeleton titleWidth="w-40" subtitleWidth="w-72" action="button" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
            </div>

            <div className="space-y-3 border-t border-white/5 pt-4">
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/5 pt-4">
              <div className="h-10 w-full animate-pulse rounded-xl bg-white/10 sm:w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}