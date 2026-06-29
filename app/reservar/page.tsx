import { prisma } from "@/lib/prisma";
import ReservationForm from "@/features/reservation/components/ReservationForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Reservar | Barbería",
  description:
    "Reserva tu hora en línea. Elige tu servicio, fecha y hora disponible.",
};

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

async function getBarbers() {
  return prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const { serviceId } = await searchParams;
  const [services, barbers] = await Promise.all([getServices(), getBarbers()]);

  // Si se pasa un serviceId, verificar que exista y esté activo
  if (serviceId) {
    const valid = services.some((s) => s.id === serviceId);
    if (!valid) notFound();
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          {/* <Link
            href="/servicios"
            className="flex items-center gap-2 
              bg-zinc-900 hover:bg-[#C8A96E] 
              text-zinc-300 hover:text-zinc-950
              border border-zinc-800 hover:border-[#C8A96E]
              px-4 py-2 rounded-xl text-xs font-semibold
              transition-all duration-300 shadow-sm"
          >
            Volver
          </Link> */}
          <p className="text-xs font-bold tracking-widest text-[#C8A96E] uppercase">
            Agenda tu visita
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white uppercase">
            Reservar Hora
          </h1>
          <div className="h-px w-16 bg-linear-to-r from-transparent via-[#C8A96E] to-transparent mx-auto mt-4" />
        </header>

        <div className="bg-zinc-900/40 border border-zinc-900 backdrop-blur-sm rounded-2xl p-6 lg:p-8">
          <ReservationForm
            services={services}
            barbers={barbers}
            defaultServiceId={serviceId}
          />
        </div>
      </div>
    </main>
  );
}
