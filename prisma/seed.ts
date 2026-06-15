// prisma/seed.ts

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "./data/categories";
import { services } from "./data/services";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  // 1. Categorías
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: category,
    });
  }

  console.log("✅ Categorías listas");

  // 2. Servicios
  for (const service of services) {
    const category = await prisma.category.findUnique({
      where: { slug: service.categorySlug },
    });

    if (!category) continue;

    await prisma.service.upsert({
      where: { slug: service.slug },
      create: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        durationMin: service.durationMin,
        categoryId: category.id,
      },
      update: {
        name: service.name,
        description: service.description,
        price: service.price,
        durationMin: service.durationMin,
        categoryId: category.id,
      },
    });
  }

  console.log("✅ Servicios listos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
