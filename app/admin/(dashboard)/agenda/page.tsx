import { ReservationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import WhatsAppButton from "@/shared/components/admin/WhatsAppButton";
import {
  formatDisplayTime,
  formatLongDate,
  formatShortDate,
  formatTwentyFourHourTime,
} from "@/shared/utils/dateFormatters";
import { formatPrice } from "@/shared/utils/formatPrice";
import Link from "next/link";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";

function getInputValue(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getTodayInputValue() {
  return getInputValue(new Date());
}

function getTomorrowInputValue() {
  return getInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
}

function getUpcomingLimitInputValue() {
  return getInputValue(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
}

function toDateStart(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateEnd(value: string) {
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string }>;
}) {
  const { date, view } = await searchParams;
  const todayInput = getTodayInputValue();
  const tomorrowInput = getTomorrowInputValue();
  const isUpcomingView = view === "upcoming";
  const selectedDate = date || todayInput;
  const selectedDateIsValid = Boolean(toDateStart(selectedDate));
  const activeDate = selectedDateIsValid ? selectedDate : todayInput;
  const isTodaySelected = !isUpcomingView && activeDate === todayInput;
  const isTomorrowSelected = !isUpcomingView && activeDate === tomorrowInput;
  const fallbackFromDate = toDateStart(todayInput)!;
  const fallbackToDate = toDateEnd(todayInput)!;
  const fromDate = isUpcomingView
    ? new Date()
    : (toDateStart(selectedDate) ?? fallbackFromDate);
  const toDate = isUpcomingView
    ? toDateEnd(getUpcomingLimitInputValue())!
    : (toDateEnd(selectedDate) ?? fallbackToDate);
  const agendaLabel = isUpcomingView
    ? "Próximas citas activas"
    : formatLongDate(fromDate);

  const reservations = await prisma.reservation.findMany({
    where: {
      status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      startAt: { gte: fromDate, lte: toDate },
    },
    include: { customer: true, service: true, barber: true },
    orderBy: { startAt: "asc" },
  });

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === ReservationStatus.PENDING,
  ).length;
  const estimatedRevenue = reservations.reduce(
    (total, reservation) => total + reservation.servicePrice,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Agenda</h2>
          <p className="mt-2 capitalize text-zinc-400">{agendaLabel}</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/agenda?date=${todayInput}`}
              aria-current={isTodaySelected ? "page" : undefined}
              className={
                isTodaySelected
                  ? "inline-flex h-9 items-center rounded-lg border border-[#C8A96E]/40 bg-[#C8A96E]/15 px-3 text-xs font-semibold text-[#F5E6C8]"
                  : "inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              }
            >
              Hoy{isTodaySelected ? " · seleccionado" : ""}
            </Link>
            <Link
              href={`/admin/agenda?date=${tomorrowInput}`}
              aria-current={isTomorrowSelected ? "page" : undefined}
              className={
                isTomorrowSelected
                  ? "inline-flex h-9 items-center rounded-lg border border-[#C8A96E]/40 bg-[#C8A96E]/15 px-3 text-xs font-semibold text-[#F5E6C8]"
                  : "inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              }
            >
              Mañana{isTomorrowSelected ? " · seleccionado" : ""}
            </Link>
            <Link
              href="/admin/agenda?view=upcoming"
              aria-current={isUpcomingView ? "page" : undefined}
              className={
                isUpcomingView
                  ? "inline-flex h-9 items-center rounded-lg border border-[#C8A96E]/40 bg-[#C8A96E]/15 px-3 text-xs font-semibold text-[#F5E6C8]"
                  : "inline-flex h-9 items-center rounded-lg border border-[#C8A96E]/30 px-3 text-xs font-semibold text-[#C8A96E] transition-colors hover:bg-[#C8A96E]/10 hover:text-[#F5E6C8]"
              }
            >
              Próximas{isUpcomingView ? " · seleccionado" : ""}
            </Link>
          </div>

          <form
            action="/admin/agenda"
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <label className="flex flex-col gap-2 text-xs text-zinc-300">
              Fecha
              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
              />
            </label>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#C8A96E] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#d8bb82]"
            >
              Ver día
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Citas</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {reservations.length}
          </p>
        </div>
        <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-yellow-500/80">
            Pendientes
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-300">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-500/80">
            Ingresos estimados
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">
            {formatPrice(estimatedRevenue)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {reservations.length > 0 ? (
          <div className="divide-y divide-white/5">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="grid gap-4 p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
              >
                <div className="flex items-center gap-2 text-[#C8A96E]">
                  <FiClock className="h-4 w-4" />
                  <span className="text-lg font-semibold">
                    {formatDisplayTime(reservation.startAt)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 font-medium text-white">
                      <FiUser className="h-4 w-4 text-zinc-500" />
                      {reservation.customer.name}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      {reservation.status}
                    </span>
                    <span className="rounded-full bg-[#C8A96E]/10 px-2.5 py-1 text-xs text-[#C8A96E]">
                      {reservation.barber?.name ?? "Sin barbero"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {isUpcomingView
                      ? `${formatShortDate(reservation.startAt)} · `
                      : ""}
                    {reservation.serviceName} · {reservation.durationMin} min ·
                    ${reservation.servicePrice.toLocaleString("es-CL")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <WhatsAppButton
                    phone={reservation.customer.phone}
                    message={`💈 *Recordatorio de cita*
Hola ${reservation.customer.name}. Te recordamos que tu cita de *${reservation.serviceName}* está programada para el día *${formatShortDate(reservation.startAt)}* a las *${formatTwentyFourHourTime(reservation.startAt)}*.
¡Te esperamos! 😊`}
                    label="Recordar cita por whatsapp"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiCalendar className="mx-auto h-8 w-8 text-zinc-600" />
            <p className="mt-3 text-zinc-400">
              {isUpcomingView
                ? "No hay próximas citas activas."
                : "No hay citas activas para este día."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
