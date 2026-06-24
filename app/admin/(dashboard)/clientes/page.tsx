import { prisma } from "@/lib/prisma";
import ClientsTable from "@/shared/components/admin/ClientsTable";

type CustomerWithReservations = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  reservations: Array<{ id: string; startAt: Date; status: string }>;
};

export default async function ClientsPage() {
  const dateFormatter = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Santiago",
  });

  const dateTimeFormatter = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  });

  const customers = await prisma.customer.findMany({
    include: {
      reservations: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { startAt: "asc" },
        take: 1,
        select: {
          id: true,
          startAt: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  }) as CustomerWithReservations[];

  const customersForTable = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    isActive: customer.isActive,
    createdAtLabel: dateFormatter.format(customer.createdAt),
    reservations: customer.reservations.map((reservation) => ({
      id: reservation.id,
      status: reservation.status,
      startAtLabel: dateTimeFormatter.format(reservation.startAt),
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Clientes</h2>
        <p className="mt-2 text-zinc-400">Gestión de clientes registrados</p>
      </div>

      <ClientsTable customers={customersForTable} />
    </div>
  );
}

