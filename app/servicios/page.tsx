import { prisma } from "@/lib/prisma";
import ServiciosSection from "@/features/servicios/components/ServicesSection";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    include: {
      category: true,
      _count: {
        select: {
          reservations: {
            where: {
              status: { in: ["COMPLETED", "CONFIRMED", "PENDING"] },
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export default async function ServiciosPage() {
  const services = await getServices();
  const maxReservations = services.length > 0 ? Math.max(...services.map(s => s._count.reservations)) : 0;
  const enrichedServices = services.map((service) => ({
    ...service,
    isMostReserved: service._count.reservations === maxReservations && maxReservations > 0,
  }));

  return (
    <ServiciosSection
      services={enrichedServices}
      emptyMessage="No hay servicios disponibles."
    />
  );
}