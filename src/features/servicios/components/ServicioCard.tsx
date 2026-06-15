"use client";

import type { Service } from "@/generated/prisma/client";
import { FiClock, FiScissors, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

type ServiceCardProps = {
  service: Service;
};

export default function ServicioCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="
        group relative w-full overflow-hidden
        rounded-2xl border border-zinc-800/80
        bg-gradient-to-b from-zinc-900 to-zinc-950
        p-6 transition-all duration-300
        hover:border-[#C8A96E]/30
        hover:shadow-2xl hover:shadow-[#C8A96E]/5
      "
    >
      <div className="absolute -inset-px bg-gradient-to-r from-transparent via-[#C8A96E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C8A96E]/80">
              <FiScissors className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Servicio Premium
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
              <FiClock className="h-3 w-3 text-[#C8A96E]" />
              <span>{service.durationMin} min</span>
            </div>
          </div>

          <h3 className="text-xl font-medium tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            {service.name}
          </h3>

          {service.description && (
            <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-2">
              {service.description}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500">
              Precio
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#C8A96E]">
                ${service.price.toLocaleString("es-CL")}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">CLP</span>
            </div>
          </div>

          {/* FiChevronRight ahora dentro del botón */}
          <Link
            href={`/reservar?serviceId=${service.id}`}
            className="flex items-center gap-2
              bg-zinc-900 hover:bg-[#C8A96E]
              text-zinc-300 hover:text-zinc-950
              border border-zinc-800 hover:border-[#C8A96E]
              px-4 py-2 rounded-xl text-xs font-semibold
              transition-all duration-300 shadow-sm"
          >
            Reservar
            <FiChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8A96E]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}
