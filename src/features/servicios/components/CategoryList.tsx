"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/generated/prisma/client";
import { motion } from "framer-motion";

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  const pathname = usePathname();

  const isAllActive = pathname === "/servicios";

  const linkBaseStyles = `
    relative flex items-center justify-between
    rounded-xl px-4 py-3 text-sm font-medium
    transition-all duration-300 border whitespace-nowrap lg:whitespace-normal
  `;

  return (
    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
      <Link
        href="/servicios"
        className={`
          ${linkBaseStyles}
          ${isAllActive
            ? "border-[#C8A96E]/40 bg-[#C8A96E]/5 text-[#F5E6C8]"
            : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
          }
        `}
      >
        <span>Todos los servicios</span>
        {isAllActive && (
          <motion.span
            layoutId="activeIndicator"
            className="hidden lg:block h-1.5 w-1.5 rounded-full"
          />
        )}
      </Link>

      {categories.map((category) => {
        const isActive = pathname === `/servicios/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={`/servicios/${category.slug}`}
            className={`
              ${linkBaseStyles}
              ${isActive
                ? "border-[#C8A96E]/40  text-[#F5E6C8]"
                : "border-zinc-900  text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
              }
            `}
          >
            <span className="relative z-10">{category.name}</span>

            {isActive && (
              <motion.span
                layoutId="activeIndicator"
                className="hidden lg:block h-1.5 w-1.5 rounded-full bg-[#C8A96E]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}