import { prisma } from "@/lib/prisma";
import ClientsTable from "@/features/reservation/components/ClientsTable";
import Pagination from "@/features/reservation/components/Pagination";
import type { Prisma } from "@/generated/prisma/client";
import AdminSearch from "@/shared/components/admin/AdminSearch";
import { formatAppointmentDateTime, formatShortDate } from "@/shared/utils/dateFormatters";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 10;

type CustomerWithReservations = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  reservations: Array<{ id: string; serviceName: string; startAt: Date; status: string }>;
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const pageNumber = Number(page);
  const currentPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const query = q?.trim() || "";

  const where: Prisma.CustomerWhereInput = query
    ? {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { notes: { contains: query, mode: "insensitive" } },
      ],
    }
    : {};

  const totalItems = await prisma.customer.count({ where });
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages > 0 && currentPage > totalPages) {
    const params = new URLSearchParams({ page: String(totalPages) });

    if (query) {
      params.set("q", query);
    }

    redirect(`/admin/clientes?${params.toString()}`);
  }

  const customers = (await prisma.customer.findMany({
    where,
    include: {
      reservations: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { startAt: "asc" },
        take: 1,
        select: {
          id: true,
          serviceName: true,
          startAt: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE,
  })) as CustomerWithReservations[];

  const customersForTable = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    isActive: customer.isActive,
    createdAtLabel: formatShortDate(customer.createdAt),
    reservations: customer.reservations.map((reservation) => ({
      id: reservation.id,
      serviceName: reservation.serviceName,
      status: reservation.status,
      startAtLabel: formatAppointmentDateTime(reservation.startAt),
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Clientes</h2>
        <p className="mt-2 text-zinc-400">Gestión de clientes registrados</p>
      </div>

      <AdminSearch
        initialQuery={query}
        placeholder="Buscar por nombre, teléfono, email o notas"
      />

      <ClientsTable customers={customersForTable} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="clientes"
      />
    </div>
  );
}

