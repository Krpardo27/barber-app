"use client";

import AdminRoutes from "@/shared/components/admin/AdminRoutes";

type SidebarAdminProps = {
  userName?: string | null;
  userEmail?: string | null;
  roleLabel?: string;
};

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "A";
}

export default function SidebarAdmin({
  userName,
  userEmail,
  roleLabel = "Administrador",
}: SidebarAdminProps) {
  return (
    <aside className="hidden self-start rounded-2xl border border-[#dedede]/10 bg-[#121212] p-5 shadow-lg shadow-black/40 backdrop-blur-md lg:sticky lg:top-4 lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="border-b border-[#dedede]/10 pb-4 mb-5">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Barber Admin
          </h2>

          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-amber-400">
            Sistema de Reservas
          </p>
        </div>

        <nav className="space-y-1">
          <AdminRoutes />
        </nav>
      </div>

      <div className="mt-6 rounded-xl border border-[#dedede]/10 bg-[#181818] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-bold text-emerald-400">
            {getInitial(userName)}
          </div>

          <div className="max-w-max">
            <p className="truncate text-sm font-medium text-white">
              {userName || "Administrador"}
            </p>
            <p
              className="truncate text-xs text-[#dedede]/50"
              title={userEmail ?? ""}
            >
              {userEmail || "Sin correo"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            {roleLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}
