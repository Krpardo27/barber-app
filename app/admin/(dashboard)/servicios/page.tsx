import { prisma } from "@/lib/prisma";
import { FiDollarSign, FiClock, FiTag } from "react-icons/fi";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: { category: true, _count: { select: { reservations: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Servicios</h2>
        <p className="mt-2 text-zinc-400">Catálogo de servicios disponibles</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">{service.description}</p>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                service.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {service.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4" />
                  Precio
                </span>
                <span className="text-white font-semibold">${service.price.toLocaleString("es-CL")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiClock className="h-4 w-4" />
                  Duración
                </span>
                <span className="text-white">{service.durationMin} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiTag className="h-4 w-4" />
                  Categoría
                </span>
                <span className="text-white">{service.category.name}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-sm text-zinc-400">Reservas</span>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-xs">
                  {service._count.reservations}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <p className="text-zinc-400">No hay servicios registrados.</p>
        </div>
      )}
    </div>
  );
}

