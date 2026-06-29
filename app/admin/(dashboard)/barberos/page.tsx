import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiEdit3, FiMail, FiPhone, FiPlus, FiUser } from "react-icons/fi";

export default async function BarbersPage() {
  const barbers = await prisma.barber.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Barberos</h2>
          <p className="mt-2 text-zinc-400">
            Administra el equipo disponible para la barberia
          </p>
        </div>

        <Link
          href="/admin/barberos/new"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#C8A96E] px-4 text-xs font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-[#F5E6C8] sm:w-auto"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo barbero
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 transition-all hover:border-white/20"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8A96E]/15 text-[#C8A96E]">
                  <FiUser className="h-5 w-5" />
                </div>
                <h3 className="truncate text-lg font-semibold text-white">
                  {barber.name}
                </h3>
                {barber.bio && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {barber.bio}
                  </p>
                )}
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  barber.isActive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {barber.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <FiPhone className="h-4 w-4 text-zinc-500" />
                <span>{barber.phone || "Sin telefono"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <FiMail className="h-4 w-4 text-zinc-500" />
                <span className="truncate">{barber.email || "Sin email"}</span>
              </div>
            </div>

            <div className="mt-5 border-t border-white/5 pt-4">
              <Link
                href={`/admin/barberos/${barber.id}/edit`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#C8A96E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#C8A96E] transition-colors hover:border-[#F5E6C8]/60 hover:bg-[#C8A96E]/10 hover:text-[#F5E6C8] sm:w-auto"
              >
                <FiEdit3 className="h-4 w-4" />
                Editar barbero
              </Link>
            </div>
          </div>
        ))}
      </div>

      {barbers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <p className="text-zinc-400">No hay barberos registrados.</p>
        </div>
      )}
    </div>
  );
}