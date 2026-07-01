import BarberAdminForm from "@/features/barbers/components/BarberAdminForm";
import { prisma } from "@/lib/prisma";
import GoBackButton from "@/shared/components/admin/GoBackButton";

export default async function NewBarberPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, durationMin: true },
  });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h2 className="text-3xl font-bold text-white">Nuevo barbero</h2>
        <p className="mt-2 text-zinc-400">
          Crea un perfil para el equipo de la barberia.
        </p>
      </div>

      <BarberAdminForm services={services} successRedirectHref="/admin/barberos" />
    </div>
  );
}