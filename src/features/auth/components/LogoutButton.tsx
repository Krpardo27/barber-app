"use client";

import { signOut } from "@/lib/auth-client";
import { FiLogOut } from "react-icons/fi";

interface LogoutButtonProps {
  callbackURL?: string;
}

export default function LogoutButton({ callbackURL = "/" }: LogoutButtonProps) {
  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = callbackURL;
        },
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 min-[390px]:text-[10px]"
    >
      <FiLogOut className="h-4 w-4 shrink-0" />
      <span className="leading-none">Salir</span>
    </button>
  );
}