import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login?callbackURL=/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>

        <p className="mt-2 text-zinc-400">
          Bienvenido, {session.user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">
            Reservas hoy
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">
            Clientes
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">
            Servicios
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">
            Próximas citas
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            0
          </p>
        </div>
      </div>
    </div>
  );
}