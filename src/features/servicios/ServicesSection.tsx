import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { category: string };
};

async function getServicesByCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { services: true },
  });

  if (!category) notFound();

  return category;
}

export default async function ServiciosSection({ params }: Props) {
  const category = await getServicesByCategory(params.category);

  return (
    <div>
     
    </div>
  );
}