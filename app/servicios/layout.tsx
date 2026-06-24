import { prisma } from "@/lib/prisma";
import CategoryList from "@/features/servicios/components/CategoryList";

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export default async function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-[#C8A96E]/30 selection:text-[#F5E6C8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <header className="text-center space-y-3">
          <p className="text-xs font-bold tracking-widest text-[#C8A96E] uppercase">
            Nuestra Carta
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white uppercase">
            Servicios
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400">
            Elige el servicio que necesitas y reserva tu hora en pocos pasos.
          </p>
          <div className="h-px w-16 bg-linear-to-r from-transparent via-[#C8A96E] to-transparent mx-auto mt-4" />
        </header>

        <CategoryList categories={categories} />

        <main className="w-full plan-grid-animation space-y-6">{children}</main>
      </div>
    </div>
  );
}