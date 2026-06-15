import { prisma } from "@/lib/prisma";
import ReservasTable from "@/shared/components/admin/ReservasTable";

export default async function ReservasPage() {
  const reservations = await prisma.reservation.findMany({
    include: { customer: true, service: true },
    orderBy: { startAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Reservas</h2>
        <p className="mt-2 text-zinc-400">Gestión de citas de clientes</p>
      </div>

      <ReservasTable reservations={reservations} />
    </div>
  );
}
