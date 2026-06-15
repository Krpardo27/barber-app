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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="text-center space-y-3">
          <p className="text-xs font-bold tracking-widest text-[#C8A96E] uppercase">
            Nuestra Carta
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white uppercase">
            Servicios & Experiencias
          </h1>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent mx-auto mt-4" />
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-64 bg-zinc-900/40 border border-zinc-900 backdrop-blur-sm p-5 lg:p-6 rounded-2xl lg:sticky lg:top-6 space-y-4">
            <h2 className="hidden lg:block text-[11px] font-bold uppercase tracking-widest text-zinc-500 px-1">
              Categorías
            </h2>
            <CategoryList categories={categories} />
          </aside>

          <main className="flex-1 w-full plan-grid-animation">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}