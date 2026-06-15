import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">

        <div className="w-16 h-16 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[#C8A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-white uppercase">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Tu hora ha sido agendada exitosamente. Te esperamos en la barbería.
          </p>
        </div>

        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent mx-auto" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/reservar"
            className="px-6 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm hover:border-zinc-600 hover:text-white transition-all"
          >
            Nueva reserva
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#C8A96E] text-stone-950 font-bold text-sm uppercase tracking-wider hover:bg-[#F5E6C8] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  );
}