"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelReservationAction(
  reservationId: string
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return {
        error: "Reserva no encontrada",
      };
    }

    if (reservation.status === "CANCELLED") {
      return {
        error: "La reserva ya está cancelada",
      };
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin/historial");
    revalidatePath("/admin");
    revalidatePath("/reservar");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible cancelar la reserva",
    };
  }
}