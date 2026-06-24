"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Swal from "sweetalert2";
import type { ReservationStatus } from "@/generated/prisma/client";
import { updateReservationStatusAction } from "@/features/reservation/actions/update-reservation-status.action";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

export default function ReservationStatusButtons({
  reservationId,
}: {
  reservationId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function updateStatus(targetStatus: ReservationStatus) {
    const confirm = await Swal.fire({
      title: "Actualizar estado",
      text: `¿Marcar cita como ${STATUS_LABEL[targetStatus]}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#16a34a",
      background: "#111111",
      color: "#f4f4f5",
    });

    if (!confirm.isConfirmed) return;

    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, targetStatus);

      if (result?.error) {
        await Swal.fire({
          title: "No se pudo actualizar",
          text: result.error,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
          background: "#111111",
          color: "#f4f4f5",
        });
        return;
      }

      await Swal.fire({
        title: "Estado actualizado",
        text: `La cita quedó como ${STATUS_LABEL[targetStatus]}.`,
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
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => updateStatus("COMPLETED")}
        className="rounded bg-blue-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Completada
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => updateStatus("NO_SHOW")}
        className="rounded bg-orange-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        No asistió
      </button>
    </div>
  );
}
