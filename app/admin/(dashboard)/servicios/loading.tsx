export default function ServiciosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="h-9 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/10" />
        </div>

        <div className="h-10 w-full animate-pulse rounded-xl bg-white/10 sm:w-40" />
      </div>

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