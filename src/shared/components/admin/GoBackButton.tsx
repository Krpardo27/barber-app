"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

type GoBackButtonProps = {
  label?: string;
};

export default function GoBackButton({ label = "Volver" }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
    >
      <FiArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}