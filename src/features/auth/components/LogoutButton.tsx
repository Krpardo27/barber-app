"use client";

import { signOut } from "@/lib/auth-client";

interface LogoutButtonProps {
  callbackURL?: string;
}

export default function LogoutButton({
  callbackURL = "/",
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
        Cerrar sesión
      </span>
    </button>
  );
}