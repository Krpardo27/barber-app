"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function buildWhatsAppUrl(phone: string, message: string) {
  // wa.me acepta número sin '+', en formato internacional
  const cleaned = phone.replace(/^\+/, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export default function ConfirmationPage() {
  const params = useSearchParams();

  const name = params.get("name") ?? "";
  const phone = params.get("phone") ?? "";
  const service = params.get("service") ?? "";
  const price = params.get("price") ?? "";
  const startAt = params.get("startAt") ?? "";
  const duration = params.get("duration") ?? "";

  const hasData = name && phone && service && startAt;

  const formattedDate = hasData
    ? new Date(startAt).toLocaleString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const whatsappMessage = hasData
    ? `Hola ${name} 👋, tu reserva ha sido confirmada:\n\n✂️ Servicio: ${service}\n📅 Fecha: ${formattedDate}\n⏱️ Duración: ${duration} min\n💰 Precio: $${Number(price).toLocaleString("es-CL")}\n\n¡Te esperamos! Si necesitas reagendar, contáctanos.`
    : "";

  const whatsappUrl = phone ? buildWhatsAppUrl(phone, whatsappMessage) : "";

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

        {hasData && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl px-5 py-5 text-left space-y-3">
            <p className="text-[#C8A96E] text-xs uppercase tracking-widest font-bold">Detalle de la reserva</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Cliente</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Servicio</span>
                <span className="text-white">{service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fecha y hora</span>
                <span className="text-white text-right max-w-[55%] capitalize">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Duración</span>
                <span className="text-white">{duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Precio</span>
                <span className="text-[#C8A96E] font-semibold">${Number(price).toLocaleString("es-CL")}</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-px w-16 bg-linear-to-r from-transparent via-[#C8A96E] to-transparent mx-auto" />

        <div className="flex flex-col gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#1ebe5c] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar confirmación por WhatsApp
            </a>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/reservar"
              className="px-6 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm hover:border-zinc-600 hover:text-white transition-all text-center"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#C8A96E] text-stone-950 font-bold text-sm uppercase tracking-wider hover:bg-[#F5E6C8] transition-colors text-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
