// app/admin/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRoleFromEmail } from "@/lib/roles";
import SidebarAdmin from "@/shared/components/admin/SidebarAdmin";
import AdminMobileDock from "@/shared/components/admin/AdminMobileDock";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login?callbackURL=/admin");
  }

  const isAdmin = getRoleFromEmail(session.user.email) === "admin";
  const displayName = session.user.name?.trim() || "Administrador";
  const displayEmail = session.user.email ?? "Sin correo";

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-4 text-[#dedede]">
        <div className="w-full max-w-md text-center border border-rose-500/20 bg-[#121212] p-8 rounded-2xl shadow-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <FiAlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2 text-white">
            Sin Autorización
          </h2>
          <p className="text-sm text-[#dedede]/65 mb-6">
            Tu cuenta ({displayEmail}) no cuenta con los permisos de administrador requeridos.
          </p>
          <Link
            href="/auth/profile"
            className="inline-flex w-full items-center justify-center rounded-xl border border-[#dedede]/15 bg-transparent px-4 py-2.5 text-sm font-medium text-[#dedede] transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            Ir a mi perfil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#dedede] antialiased selection:bg-[#dedede]/10 selection:text-[#dedede]">
      <div className="mx-auto max-w-400 w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] p-4 gap-4 lg:gap-6">

        <SidebarAdmin userName={displayName} userEmail={displayEmail} />

        <section className="min-h-[calc(100vh-2rem)] rounded-2xl border border-[#dedede]/10 bg-[#141414] p-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] shadow-xl shadow-black/20 md:p-8 lg:pb-10">
          <header className="mb-8 border-b border-[#dedede]/10 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Vista general
                </h1>
                <p className="mt-2 text-sm text-[#dedede]/50">
                  Gestiona tu barbería, citas y barberos.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 self-start rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 font-bold text-emerald-400">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Panel Control
                  </p>
                  <p className="font-semibold text-white text-sm">{displayName}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="w-full">{children}</div>
        </section>
      </div>

      <AdminMobileDock />
    </div>
  );
}