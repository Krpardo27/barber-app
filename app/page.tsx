"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiScissors, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans overflow-x-hidden selection:bg-[#C8A96E]/30 selection:text-[#F5E6C8]">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col px-4 pt-10 pb-10 bg-stone-950">
        {/* background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />

        {/* HERO CONTENT (CENTRADO REAL) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10 gap-10">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-full"
          >
            <FiScissors className="h-3 w-3 text-[#C8A96E]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              Estilo • Tradición • Filo
            </span>
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="
              text-5xl sm:text-5xl md:text-7xl
              font-serif font-black uppercase leading-[1.05]
              text-white px-2
            "
          >
            Corte con{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96E] via-[#F5E6C8] to-[#C8A96E]">
              Identidad
            </span>
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              max-w-xs sm:max-w-md md:max-w-xl
              text-stone-400
             text-md
              font-light leading-relaxed px-4
            "
          >
            No es solo un corte de cabello, es un ritual. Vive la experiencia de
            la barbería clásica en Santiago.
          </motion.p>

          <div className="h-[1px] w-12 bg-[#C8A96E]/40" />
          <div className="w-full max-w-sm mx-auto relative z-10">
            <Link href="/servicios">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="
                flex items-center justify-center gap-3
                bg-gradient-to-r from-[#C8A96E] to-[#b39359]
                text-zinc-950 w-full py-4 rounded-xl
                font-bold text-xs uppercase tracking-widest
                border border-[#F5E6C8]/20
                shadow-xl active:brightness-90
              "
              >
                <FiCalendar className="h-4 w-4" />
                Ver Servicios & Agendar
              </motion.div>
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none" />
      </section>

      <section className="w-full pb-14 relative z-20">
        <div className="px-6 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E]">
            ¿Por qué elegirnos?
          </p>
          <h2 className="text-lg font-serif font-bold text-white uppercase">
            La Experiencia
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-none">
          {[
            {
              icon: FiScissors,
              title: "Barberos Expertos",
              desc: "Especialistas dedicados a perfeccionar tu estilo.",
            },
            {
              icon: FiClock,
              title: "Atención Premium",
              desc: "Sin esperas, experiencia personalizada.",
            },
            {
              icon: FiMapPin,
              title: "Ubicación Central",
              desc: "Ambiente diseñado para tu comodidad.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="
                w-[80%] sm:w-72 shrink-0 snap-center
                bg-zinc-900/40 border border-zinc-900
                p-5 rounded-2xl space-y-3
              "
            >
              <div className="h-9 w-9 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center border border-[#C8A96E]/20">
                <item.icon className="h-4 w-4 text-[#C8A96E]" />
              </div>

              <h3 className="text-base font-medium text-white">{item.title}</h3>

              <p className="text-xs text-stone-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-2 lg:hidden">
          <span className="h-1 w-4 rounded-full bg-[#C8A96E]" />
          <span className="h-1 w-1 rounded-full bg-zinc-800" />
          <span className="h-1 w-1 rounded-full bg-zinc-800" />
        </div>
      </section>
    </div>
  );
}
