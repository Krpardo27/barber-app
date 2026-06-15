import { prisma } from "@/lib/prisma";
import ServicioCard from "@/features/servicios/components/ServicioCard";
import { notFound } from "next/navigation";

async function getServices(categorySlug?: string) {
  return prisma.service.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: true,
    },
  });
}

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  const { category } = await params;

  // Verificar que la categoría exista
  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (!cat) notFound();
  }

  const services = await getServices(category);

  if (services.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl">
        <p className="text-stone-400">No hay servicios disponibles en esta categoría.</p>
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