import BarberAdminForm from "@/features/barbers/components/BarberAdminForm";
import { prisma } from "@/lib/prisma";
import GoBackButton from "@/shared/components/admin/GoBackButton";
import { notFound } from "next/navigation";

type EditBarberPageProps = {
  params: Promise<{ id?: string }>;
};

export default async function EditBarberPage({ params }: EditBarberPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const barber = await prisma.barber.findUnique({
    where: { id },
  });

  if (!barber) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h2 className="text-3xl font-bold text-white">Editar barbero</h2>
        <p className="mt-2 text-zinc-400">
          Actualiza los datos de {barber.name}.
        </p>
      </div>

      <BarberAdminForm barber={barber} successRedirectHref="/admin/barberos" />
    </div>
  );
}