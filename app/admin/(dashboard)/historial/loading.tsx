import {
  AdminFilterSkeleton,
  AdminHeadingSkeleton,
} from "@/shared/components/admin/AdminLoadingSkeletons";
import AdminTableSkeleton from "@/shared/components/admin/AdminTableSkeleton";

export default function HistorialLoading() {
  return (
    <div className="space-y-6">
      <AdminHeadingSkeleton titleWidth="w-40" subtitleWidth="w-80" />
      <AdminFilterSkeleton height="h-24" />
      <AdminFilterSkeleton height="h-24" />
      <AdminTableSkeleton rows={8} columns={8} />
    </div>
  );
}