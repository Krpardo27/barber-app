import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiClock, FiDollarSign, FiEdit3, FiPlus, FiTag } from "react-icons/fi";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: { category: true, _count: { select: { reservations: true } } },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Servicios</h2>
          <p className="mt-2 text-zinc-400">
            Edita y publica el catalogo de servicios
          </p>
        </div>

        <Link
          href="/admin/servicios/new"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#C8A96E] px-4 text-xs font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-[#F5E6C8] sm:w-auto"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo servicio
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {service.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {service.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  service.isActive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {service.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4" />
                  Precio
                </span>
                <span className="text-white font-semibold">
                  ${service.price.toLocaleString("es-CL")}
                </span>
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

            <div className="mt-5 border-t border-white/5 pt-4">
              <Link
                href={`/admin/servicios/${service.id}/edit`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#C8A96E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#C8A96E] transition-colors hover:border-[#F5E6C8]/60 hover:bg-[#C8A96E]/10 hover:text-[#F5E6C8] sm:w-auto"
              >
                <FiEdit3 className="h-4 w-4" />
                Editar servicio
              </Link>
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
