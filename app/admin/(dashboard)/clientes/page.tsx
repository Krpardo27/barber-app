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
  updatedAt: Date;
  reservations: Array<{ id: string }>;
};

export default async function ClientsPage() {
  const customers = await prisma.customer.findMany({
    include: { reservations: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  }) as CustomerWithReservations[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Clientes</h2>
        <p className="mt-2 text-zinc-400">Gestión de clientes registrados</p>
      </div>

      <ClientsTable customers={customers} />
    </div>
  );
}

