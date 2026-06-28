export default function AgendaLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-9 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>

        <div className="h-16 rounded-2xl border border-white/10 bg-white/5 sm:w-72" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-8 w-12 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>

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