import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiUsers, FiCalendar, FiScissors, FiClock } from "react-icons/fi";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login?callbackURL=/admin");
  }

  // Obtener datos reales de la BD
  const now = new Date();
  const today = new Date(now.toDateString());
  const tomorrow = new Date(today.getTime() + 86400000);
  
  const [totalClientes, reservasHoy, totalServicios, proximasReservas] = await Promise.all([
    prisma.customer.count(),
    prisma.reservation.count({
      where: {
        startAt: {
          gte: today,
          lt: tomorrow,
        },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.reservation.count({
      where: {
        startAt: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
  ]);

  const stats = [
    {
      label: "Clientes Registrados",
      value: totalClientes,
      icon: FiUsers,
      color: "from-blue-600 to-blue-700",
      href: "/admin/clientes",
    },
    {
      label: "Reservas Hoy",
      value: reservasHoy,
      icon: FiCalendar,
      color: "from-green-600 to-green-700",
      href: "/admin/reservas",
    },
    {
      label: "Servicios Activos",
      value: totalServicios,
      icon: FiScissors,
      color: "from-amber-600 to-amber-700",
      href: "/admin/servicios",
    },
    {
      label: "Próximas Citas",
      value: proximasReservas,
      icon: FiClock,
      color: "from-purple-600 to-purple-700",
      href: "/admin/reservas",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>
        <p className="mt-2 text-zinc-400">
          Bienvenido, {session.user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-5 hover:border-white/20 transition-all cursor-pointer group">
                <div className={`inline-flex p-2 rounded-lg bg-linear-to-r ${stat.color} bg-opacity-10 mb-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}