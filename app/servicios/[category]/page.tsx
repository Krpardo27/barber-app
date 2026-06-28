import { prisma } from "@/lib/prisma";
import ServiciosSection from "@/features/servicios/components/ServicesSection";
import { notFound } from "next/navigation";

async function getServices(categorySlug?: string) {
  return prisma.service.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
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

  return (
    <ServiciosSection
      services={services}
      emptyMessage="No hay servicios disponibles en esta categoria."
    />
  );
}