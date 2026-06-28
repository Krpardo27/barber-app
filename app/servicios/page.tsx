import { prisma } from "@/lib/prisma";
import ServiciosSection from "@/features/servicios/components/ServicesSection";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <ServiciosSection
      services={services}
      emptyMessage="No hay servicios disponibles."
    />
  );
}