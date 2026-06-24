"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Swal from "sweetalert2";
import { cancelReservationAction } from "@/features/reservation/actions/cancel-reservation.action";

export function CancelReservationButton({
  reservationId,
}: {
  reservationId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleCancel() {
    const result = await Swal.fire({
      title: "Cancelar cita",
      text: "Esta acción liberará el horario para nuevas reservas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) return;

    startTransition(async () => {
      const actionResult = await cancelReservationAction(reservationId);

      if (actionResult?.error) {
        await Swal.fire({
          title: "No se pudo cancelar",
          text: actionResult.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      await Swal.fire({
        title: "Cita cancelada",
        text: "La cita se movió al historial y el horario quedó disponible.",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#16a34a",
        background: "#111111",
        color: "#f4f4f5",
      });

      router.refresh();
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="rounded bg-red-600 px-3 py-1 text-white"
    >
      {isPending ? "Cancelando..." : "Cancelar"}
    </button>
  );
}