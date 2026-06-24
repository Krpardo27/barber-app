"use server";

import { revalidatePath } from "next/cache";
import type { ReservationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const ALLOWED_TARGET_STATUSES: ReservationStatus[] = ["COMPLETED", "NO_SHOW"];

export async function updateReservationStatusAction(
  reservationId: string,
  targetStatus: ReservationStatus
) {
  try {
    if (!ALLOWED_TARGET_STATUSES.includes(targetStatus)) {
      return { error: "Estado de destino no permitido" };
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return { error: "Reserva no encontrada" };
    }

    if (!["PENDING", "CONFIRMED"].includes(reservation.status)) {
      return {
        error: "Solo reservas pendientes o confirmadas pueden cambiar de estado",
      };
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: targetStatus,
        completedAt: targetStatus === "COMPLETED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/reservas");
    revalidatePath("/admin/historial");
    revalidatePath("/admin/clientes");
    revalidatePath("/reservar");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No fue posible actualizar el estado de la reserva" };
  }
}
