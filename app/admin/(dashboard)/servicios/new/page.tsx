import ServiceAdminForm from "@/features/servicios/components/ServiceAdminForm";
import { prisma } from "@/lib/prisma";
import GoBackButton from "@/shared/components/admin/GoBackButton";

export default async function NewServicePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h2 className="text-3xl font-bold text-white">Nuevo servicio</h2>
        <p className="mt-2 text-zinc-400">Crea un servicio para publicarlo en el catalogo.</p>
      </div>

      <ServiceAdminForm categories={categories} successRedirectHref="/admin/servicios" />
    </div>
  );
}