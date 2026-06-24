"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/generated/prisma/client";

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  const pathname = usePathname();

  const isAllActive = pathname === "/servicios";

  const linkBaseStyles = "inline-flex h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors";

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
      <Link
        href="/servicios"
        className={`${linkBaseStyles} ${
          isAllActive
            ? "border-[#C8A96E]/40 bg-[#C8A96E]/5 text-[#F5E6C8]"
            : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
        }`}
      >
        Todos
      </Link>

      {categories.map((category) => {
        const isActive = pathname === `/servicios/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={`/servicios/${category.slug}`}
            className={`${linkBaseStyles} ${
              isActive
                ? "border-[#C8A96E]/40 bg-[#C8A96E]/5 text-[#F5E6C8]"
                : "border-zinc-900  text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}