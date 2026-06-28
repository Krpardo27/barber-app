import AdminTableSkeleton from "@/shared/components/admin/AdminTableSkeleton";

export default function ClientesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-36 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
      </div>

      <div className="h-20 rounded-2xl border border-white/10 bg-white/5" />
      <AdminTableSkeleton rows={8} columns={6} />
    </div>
  );
}