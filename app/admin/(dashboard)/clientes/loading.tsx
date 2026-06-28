import { AdminTablePageSkeleton } from "@/shared/components/admin/AdminLoadingSkeletons";

export default function ClientesLoading() {
  return <AdminTablePageSkeleton columns={6} titleWidth="w-36" subtitleWidth="w-64" />;
}