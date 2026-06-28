"use server";

import { prisma } from "@/lib/prisma";
import type { ReservationStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

const DELETABLE_RESERVATION_STATUSES: ReservationStatus[] = [
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

export async function deleteReservationAction(reservationId: string) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { status: true },
    });

    if (!reservation) {
      return {
        error: "Reserva no encontrada.",
      };
    }

    if (!DELETABLE_RESERVATION_STATUSES.includes(reservation.status)) {
      return {
        error: "Solo se pueden eliminar reservas del historial.",
      };
    }

    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    revalidatePath("/admin/historial");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible eliminar la reserva.",
    };
  }
}