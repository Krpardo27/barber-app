import { prisma } from "@/lib/prisma";
import ReservasTable from "@/features/reservation/components/ReservasTable";
import type { Prisma, ReservationStatus } from "@/generated/prisma/client";
import ExportCompletedReservationsButton from "@/shared/components/admin/ExportCompletedReservationsButton";
import HistorialFilters from "@/shared/components/admin/HistorialFilters";
import { formatAppointmentDateTime } from "@/shared/utils/dateFormatters";
import { formatPrice } from "@/shared/utils/formatPrice";
import { notFound } from "next/navigation";

type HistorialStatus = "ALL" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
const HISTORY_STATUSES: ReservationStatus[] = ["CANCELLED", "COMPLETED", "NO_SHOW"];

function toDateStart(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateEnd(value: string) {
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTodayInputValue() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? null : value;
}

function isValidStatus(value: string): value is HistorialStatus {
  return ["ALL", "CANCELLED", "COMPLETED", "NO_SHOW"].includes(value);
}

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const status = getSingleParam(params.status);
  let selectedStatus: HistorialStatus = "ALL";

  if (status === null) {
    notFound();
  }

  if (status) {
    if (!isValidStatus(status)) {
      notFound();
    }

    selectedStatus = status;
  }

  const from = getSingleParam(params.from) || "";
  const to = getSingleParam(params.to) || "";
  const fromDate = from ? toDateStart(from) : null;
  const toDate = to ? toDateEnd(to) : null;
  const completedFrom = from || getTodayInputValue();
  const completedTo = to || completedFrom;
  const completedFromDate = toDateStart(completedFrom)!;
  const completedToDate = toDateEnd(completedTo)!;

  const rangeFilter = {
    ...(fromDate ? { gte: fromDate } : {}),
    ...(toDate ? { lte: toDate } : {}),
  };

  const hasRange = Boolean(fromDate || toDate);

  const whereClause: Prisma.ReservationWhereInput = {
    status:
      selectedStatus === "ALL"
        ? { in: HISTORY_STATUSES }
        : selectedStatus,
    ...(hasRange
      ? selectedStatus === "CANCELLED"
        ? { cancelledAt: rangeFilter }
        : selectedStatus === "COMPLETED"
          ? { completedAt: rangeFilter }
          : selectedStatus === "NO_SHOW"
            ? { startAt: rangeFilter }
            : {
                OR: [
                  { status: "CANCELLED", cancelledAt: rangeFilter },
                  { status: "COMPLETED", completedAt: rangeFilter },
                  { status: "NO_SHOW", startAt: rangeFilter },
                ],
              }
      : {}),
  };

  const reservations = await prisma.reservation.findMany({
    where: whereClause,
    include: { customer: true, service: true, barber: true },
    orderBy: [{ cancelledAt: "desc" }, { completedAt: "desc" }, { startAt: "desc" }],
    take: 100,
  });

  const completedReservations = await prisma.reservation.findMany({
    where: {
      status: "COMPLETED",
      completedAt: { gte: completedFromDate, lte: completedToDate },
    },
    include: { customer: true, service: true, barber: true },
    orderBy: { completedAt: "desc" },
  });

  const completedTotal = completedReservations.reduce(
    (total, reservation) => total + reservation.servicePrice,
    0,
  );

  const completedExportRows = completedReservations.map((reservation) => ({
    customerName: reservation.customer.name,
    customerPhone: reservation.customer.phone,
    customerEmail: reservation.customer.email || "",
    barberName: reservation.barber?.name || "Sin asignar",
    serviceName: reservation.serviceName,
    appointmentDate: formatAppointmentDateTime(reservation.startAt),
    completedDate: reservation.completedAt
      ? formatAppointmentDateTime(reservation.completedAt)
      : "",
    durationMin: reservation.durationMin,
    servicePrice: reservation.servicePrice,
  }));

  const completedRangeLabel =
    completedFrom === completedTo
      ? completedFrom
      : `${completedFrom} a ${completedTo}`;

  const hasActiveFilters = selectedStatus !== "ALL" || Boolean(from) || Boolean(to);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Historial</h2>
        <p className="mt-2 text-zinc-400">
          Reservas canceladas, completadas o con inasistencia
        </p>
      </div>

      <HistorialFilters selectedStatus={selectedStatus} from={from} to={to} />

      <section className="grid gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
            Completadas: {completedRangeLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-sm text-zinc-200">
              {completedReservations.length} clientes
            </span>
            <span className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-sm font-semibold text-white">
              Total {formatPrice(completedTotal)}
            </span>
          </div>
        </div>

        <ExportCompletedReservationsButton
          rows={completedExportRows}
          total={completedTotal}
          fileName={`clientes-completados-${completedFrom}-${completedTo}.xlsx`}
        />
      </section>

      {hasActiveFilters && (
        <p className="text-xs text-zinc-400">
          Filtros activos: {selectedStatus !== "ALL" ? selectedStatus : "ALL"}
          {from ? ` | desde ${from}` : ""}
          {to ? ` | hasta ${to}` : ""}
        </p>
      )}

      <ReservasTable reservations={reservations} showDeleteAction />
    </div>
  );
}
