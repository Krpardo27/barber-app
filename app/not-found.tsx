import Link from "next/link";
import { FiScissors } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C8A96E]/40 to-transparent" />

      <div className="space-y-6 max-w-sm">
        {/* Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/20 flex items-center justify-center">
          <FiScissors className="h-7 w-7 text-[#C8A96E]" />
        </div>

        {/* Error code */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E]">
          Error 404
        </p>

        <h1 className="text-4xl font-serif font-black uppercase text-white leading-tight">
          Página no<br />encontrada
        </h1>

        <div className="h-px w-12 bg-[#C8A96E]/40 mx-auto" />

        <p className="text-zinc-400 text-sm leading-relaxed">
          La página que buscas no existe o fue movida. Vuelve al inicio y reserva tu próxima visita.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#C8A96E] text-stone-950 font-bold text-sm uppercase tracking-wider hover:bg-[#F5E6C8] transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/reservar"
            className="px-6 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm hover:border-zinc-600 hover:text-white transition-all"
          >
            Reservar hora
          </Link>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C8A96E]/40 to-transparent" />
    </main>
  );
}
