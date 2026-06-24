import ServiceAdminForm from "@/features/servicios/components/ServiceAdminForm";
import { prisma } from "@/lib/prisma";
import GoBackButton from "@/shared/components/admin/GoBackButton";
import { notFound } from "next/navigation";

type EditServicePageProps = {
  params: Promise<{ id?: string }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: {
      OR: [{ isActive: true }, { id: service.categoryId }],
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h2 className="text-3xl font-bold text-white">Editar servicio</h2>
        <p className="mt-2 text-zinc-400">Actualiza los datos de {service.name}.</p>
      </div>

      <ServiceAdminForm
        categories={categories}
        service={service}
        successRedirectHref="/admin/servicios"
      />
    </div>
  );
}