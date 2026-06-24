"use client";

import { signOut } from "@/lib/auth-client";
import { FiLogOut } from "react-icons/fi";

interface LogoutButtonProps {
  callbackURL?: string;
  variant?: "sidebar" | "dock";
}

export default function LogoutButton({
  callbackURL = "/",
  variant = "sidebar",
}: LogoutButtonProps) {
  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = callbackURL;
        },
      },
    });
  }

  if (variant === "dock") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-[10px] font-bold uppercase tracking-wide text-red-300 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
      >
        <FiLogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
    relative
    mt-3
    rounded-lg
    py-2
    pl-4
    pr-3
    text-left
    text-sm
    text-zinc-400
    transition-colors
    bg-white/5
    hover:text-white
    disabled:pointer-events-none
    disabled:opacity-50 cursor-pointer
  "
    >
      <span className="flex items-center gap-3">
        <FiLogOut className="h-4 w-4" />
        Cerrar sesión
      </span>
    </button>
  );
}