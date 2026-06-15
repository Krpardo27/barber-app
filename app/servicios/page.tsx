import { prisma } from "@/lib/prisma";
import ServicioCard from "@/features/servicios/components/ServicioCard";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    include: { category: true },
  });
}

export default async function ServiciosPage() {
  const services = await getServices();

  if (services.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl">
        <p className="text-stone-400">No hay servicios disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <ServicioCard key={service.id} service={service} />
      ))}
    </div>
  );
}