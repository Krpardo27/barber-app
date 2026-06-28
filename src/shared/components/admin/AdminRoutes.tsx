"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAdminRouteActive } from "./isAdminRouteActive";
import {
  FiHome,
  FiCalendar,
  FiClock,
  FiUsers,
  FiScissors,
  FiArchive,
} from "react-icons/fi";

export const ADMIN_ROUTES = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: FiHome,
  },
  {
    href: "/admin/reservas",
    label: "Reservas",
    icon: FiCalendar,
  },
  {
    href: "/admin/agenda",
    label: "Agenda",
    icon: FiClock,
  },
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: FiUsers,
  },
  {
    href: "/admin/servicios",
    label: "Servicios",
    icon: FiScissors,
  },
  {
    href: "/admin/historial",
    label: "Historial",
    icon: FiArchive,
  },
];

export default function AdminRoutes() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-col gap-1.5">
      {ADMIN_ROUTES.map((route) => {
        const active = isAdminRouteActive(pathname, route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={
              active
                ? "relative rounded-lg bg-white/10 py-2 pl-4 pr-3 text-sm font-semibold text-white"
                : "relative rounded-lg py-2 pl-4 pr-3 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            }
          >
            <span
              className={
                active
                  ? "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-amber-400"
                  : "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-transparent"
              }
            />

            <span className="flex items-center gap-3">
              <route.icon className="h-4 w-4" />
              {route.label}
            </span>
          </Link>
        );
      })}

      <LogoutButton />
    </nav>
  );
}