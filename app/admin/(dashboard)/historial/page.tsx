import { prisma } from "@/lib/prisma";
import ReservasTable from "@/shared/components/admin/ReservasTable";
import type { Prisma, ReservationStatus } from "@/generated/prisma/client";
import HistorialFilters from "@/shared/components/admin/HistorialFilters";
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
    include: { customer: true, service: true },
    orderBy: [{ cancelledAt: "desc" }, { completedAt: "desc" }, { startAt: "desc" }],
    take: 100,
  });

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

      {hasActiveFilters && (
        <p className="text-xs text-zinc-400">
          Filtros activos: {selectedStatus !== "ALL" ? selectedStatus : "ALL"}
          {from ? ` | desde ${from}` : ""}
          {to ? ` | hasta ${to}` : ""}
        </p>
      )}

      <ReservasTable reservations={reservations} />
    </div>
  );
}
