"use client";

import { deleteReservationAction } from "@/features/reservation/actions/delete-reservation.action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

export default function DeleteReservationButton({
  reservationId,
}: {
  reservationId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirm = await Swal.fire({
      title: "Eliminar del historial",
      text: "Esta reserva se eliminará definitivamente de la base de datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await deleteReservationAction(reservationId);

      if (result?.error) {
        await Swal.fire({
          title: "No se pudo eliminar",
          text: result.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-500/25 px-3 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FiTrash2 className="h-4 w-4" />
      {isPending ? "Eliminando" : "Eliminar"}
    </button>
  );
}