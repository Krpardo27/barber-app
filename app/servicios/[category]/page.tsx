import { prisma } from "@/lib/prisma";
import ServiciosSection from "@/features/servicios/components/ServicesSection";
import { notFound } from "next/navigation";

async function getServices(categorySlug?: string) {
  return prisma.service.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
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

export default async function ServiciosCategoryPage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  const { category } = await params;

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (!cat) notFound();
  }

  const services = await getServices(category);
  const maxReservations = services.length > 0 ? Math.max(...services.map(s => s._count.reservations)) : 0;
  const enrichedServices = services.map((service) => ({
    ...service,
    isMostReserved: service._count.reservations === maxReservations && maxReservations > 0,
  }));

  return (
    <ServiciosSection
      services={enrichedServices}
      emptyMessage="No hay servicios disponibles en esta categoria."
    />
  );
}