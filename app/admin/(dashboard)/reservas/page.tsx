import Pagination from "@/features/reservation/components/Pagination";
import ReservasTable from "@/features/reservation/components/ReservasTable";
import type { Prisma } from "@/generated/prisma/client";
import { ReservationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import AdminSearch from "@/shared/components/admin/AdminSearch";
import ReservationFilters from "@/shared/components/admin/ReservationFilters";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface ReservasPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    date?: string;
    serviceId?: string;
  }>;
}

type ReservationFilterStatus = "ALL" | "PENDING" | "CONFIRMED";

function isReservationFilterStatus(value: string): value is ReservationFilterStatus {
  return ["ALL", "PENDING", "CONFIRMED"].includes(value);
}

function toDateStart(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateEnd(value: string) {
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildReservationParams(values: {
  page?: number;
  query: string;
  status: ReservationFilterStatus;
  date: string;
  serviceId: string;
}) {
  const params = new URLSearchParams();

  if (values.page) params.set("page", String(values.page));
  if (values.query) params.set("q", values.query);
  if (values.status !== "ALL") params.set("status", values.status);
  if (values.date) params.set("date", values.date);
  if (values.serviceId) params.set("serviceId", values.serviceId);

  return params;
}

export default async function ReservasPage({ searchParams }: ReservasPageProps) {
  const { page, q, status, date, serviceId } = await searchParams;
  const pageNumber = Number(page);
  const currentPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const query = q?.trim() || "";
  const selectedStatus = status && isReservationFilterStatus(status) ? status : "ALL";
  const selectedDate = date || "";
  const selectedServiceId = serviceId || "";
  const fromDate = selectedDate ? toDateStart(selectedDate) : null;
  const toDate = selectedDate ? toDateEnd(selectedDate) : null;

  const where: Prisma.ReservationWhereInput = {
    status:
      selectedStatus === "ALL"
        ? { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] }
        : selectedStatus,
    ...(selectedServiceId ? { serviceId: selectedServiceId } : {}),
    ...(fromDate && toDate ? { startAt: { gte: fromDate, lte: toDate } } : {}),
    ...(query
      ? {
          OR: [
            { serviceName: { contains: query, mode: "insensitive" } },
            { customer: { name: { contains: query, mode: "insensitive" } } },
            { customer: { phone: { contains: query, mode: "insensitive" } } },
            { customer: { email: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [totalItems, services] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.service.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages > 0 && currentPage > totalPages) {
    const params = buildReservationParams({
      page: totalPages,
      query,
      status: selectedStatus,
      date: selectedDate,
      serviceId: selectedServiceId,
    });

    redirect(`/admin/reservas?${params.toString()}`);
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: { customer: true, service: true },
    orderBy: { startAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Reservas</h2>
        <p className="mt-2 text-zinc-400">Citas activas (pendientes y confirmadas)</p>
      </div>

      <AdminSearch
        initialQuery={query}
        placeholder="Buscar por cliente, teléfono, email o servicio"
      />

      <ReservationFilters
        status={selectedStatus}
        date={selectedDate}
        serviceId={selectedServiceId}
        services={services}
      />

      <ReservasTable
        reservations={reservations}
        showCancelAction
        showStatusActions
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}