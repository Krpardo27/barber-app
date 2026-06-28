"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES } from "./AdminRoutes";
import { isAdminRouteActive } from "./isAdminRouteActive";
import LogoutButton from "@/features/auth/components/LogoutButton";

export default function AdminMobileDock() {
  const pathname = usePathname();

  const triggerHapticFeedback = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(12);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="animate-[dockIn_380ms_cubic-bezier(0.16,1,0.3,1)] relative mx-auto max-w-xl overflow-hidden rounded-[1.35rem] border border-[#dedede]/10 bg-[#111111]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl motion-reduce:animate-none">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#C8A96E]/70 to-transparent" />
        <nav className="grid grid-cols-3 gap-1 p-1.5">
          {ADMIN_ROUTES.map((route) => {
            const active = isAdminRouteActive(pathname, route.href);

            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={triggerHapticFeedback}
                className={
                  active
                    ? "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl border border-[#C8A96E]/30 bg-[#C8A96E]/15 px-1 py-1 text-[9px] font-semibold text-white min-[380px]:text-[10px]"
                    : "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 text-[9px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white min-[380px]:text-[10px]"
                }
              >
                <Icon className="h-4 w-4" />

                <span className="line-clamp-1 leading-none">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex justify-center border-t border-[#dedede]/10 px-2 py-1.5">
          <LogoutButton variant="dock" />
        </div>
      </div>
    </div>
  );
}
