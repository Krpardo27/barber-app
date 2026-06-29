import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/shared/utils/formatPrice";
import Link from "next/link";
import { notFound } from "next/navigation";

const BARBERSHOP_WHATSAPP_PHONE =
  process.env.BARBERSHOP_WHATSAPP_PHONE ??
  process.env.NEXT_PUBLIC_BARBERSHOP_WHATSAPP_PHONE ??
  "";

type ConfirmationPageProps = {
  searchParams: Promise<{ id?: string }>;
};

function buildWhatsAppUrl(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, "");

  if (!cleaned) {
    return "";
  }

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

function formatReservationDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: {
      serviceName: true,
      servicePrice: true,
      durationMin: true,
      startAt: true,
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
      barber: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!reservation) {
    notFound();
  }

  const formattedDate = formatReservationDate(reservation.startAt);

  const whatsappMessage = [
    `Hola, soy ${reservation.customer.name}.`,
    `Acabo de reservar: ${reservation.serviceName} para el ${formattedDate}.`,
    reservation.barber ? `Barbero seleccionado: ${reservation.barber.name}.` : "",
    `Mi telefono es ${reservation.customer.phone}.`,
    "Quedo atento a la confirmación. Gracias.",
  ].filter(Boolean).join("\n");
  const whatsappUrl = buildWhatsAppUrl(BARBERSHOP_WHATSAPP_PHONE, whatsappMessage);

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-10 text-stone-100 sm:py-14">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C8A96E]/30 bg-[#C8A96E]/10">
          <svg
            className="h-8 w-8 text-[#C8A96E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold uppercase text-white sm:text-3xl">
            Reserva confirmada
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Tu hora fue agendada correctamente. Guarda el detalle y contacta a la barbería si necesitas ajustar algo.
          </p>
        </div>

        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-5 text-left sm:px-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E]">
            Detalle de la reserva
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:flex-row sm:justify-between">
              <span className="text-zinc-400">Cliente</span>
              <span className="font-medium text-white sm:text-right">{reservation.customer.name}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:flex-row sm:justify-between">
              <span className="text-zinc-400">Servicio</span>
              <span className="text-white sm:text-right">{reservation.serviceName}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:flex-row sm:justify-between">
              <span className="text-zinc-400">Fecha y hora</span>
              <span className="capitalize text-white sm:max-w-[60%] sm:text-right">{formattedDate}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:flex-row sm:justify-between">
              <span className="text-zinc-400">Barbero</span>
              <span className="text-white sm:text-right">
                {reservation.barber?.name ?? "Sin asignar"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:flex-row sm:justify-between">
              <span className="text-zinc-400">Duracion</span>
              <span className="text-white sm:text-right">{reservation.durationMin} min</span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
              <span className="text-zinc-400">Precio</span>
              <span className="text-xl font-bold text-[#C8A96E] sm:text-right">
                {formatPrice(reservation.servicePrice)}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-16 bg-linear-to-r from-transparent via-[#C8A96E] to-transparent" />

        <div className="flex flex-col gap-3">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1ebe5c]"
            >
              Contactar por WhatsApp
            </a>
          ) : (
            ''
          )}

          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <Link
              href="/reservar"
              className="rounded-xl border border-zinc-800 px-6 py-3 text-center text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:text-white"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#C8A96E] px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-stone-950 transition-colors hover:bg-[#F5E6C8]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
