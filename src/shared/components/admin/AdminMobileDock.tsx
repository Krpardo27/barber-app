"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES } from "./AdminRoutes";
import LogoutButton from "@/features/auth/components/LogoutButton";

export default function AdminMobileDock() {
  const pathname = usePathname();

  const triggerHapticFeedback = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(12);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="animate-[dockIn_380ms_cubic-bezier(0.16,1,0.3,1)] relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-[#dedede]/15 bg-[#111111]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl motion-reduce:animate-none">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-emerald-300/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-12 top-3 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
        <nav className="grid grid-cols-5 gap-1 p-2">
          {ADMIN_ROUTES.map((route) => {
            const active =
              pathname === route.href ||
              pathname.startsWith(`${route.href}/`);

            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={triggerHapticFeedback}
                className={
                  active
                    ? "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/15 px-1.5 py-1 text-[10px] font-semibold text-white"
                    : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1 text-[10px] font-medium text-zinc-400"
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

        <div className="border-t border-[#dedede]/10 p-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
