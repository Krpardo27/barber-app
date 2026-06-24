import type { Service } from "@/generated/prisma/client";
import { FiChevronRight, FiClock, FiStar } from "react-icons/fi";
import Link from "next/link";

type ServiceCardProps = {
  service: Service;
  isMostReserved?: boolean;
};

export default function ServicioCard({
  service,
  isMostReserved = false,
}: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 transition-colors hover:border-[#C8A96E]/35 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          {isMostReserved && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              <FiStar className="h-3 w-3" />
              Más reservado
            </span>
          )}

          <div className="ml-auto flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-400">
            <FiClock className="h-3 w-3 text-[#C8A96E]" />
            <span>{service.durationMin} min</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white">
            {service.name}
          </h3>

          {service.description && (
            <p className="text-sm font-light leading-relaxed text-zinc-400">
              {service.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-zinc-900 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-zinc-500">
            Precio
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-[#C8A96E]">
              ${service.price.toLocaleString("es-CL")}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">CLP</span>
          </div>
        </div>

        <Link
          href={`/reservar?serviceId=${service.id}`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C8A96E]/30 bg-[#C8A96E] px-4 text-xs font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-[#F5E6C8] sm:w-auto"
        >
          Reservar
          <FiChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
