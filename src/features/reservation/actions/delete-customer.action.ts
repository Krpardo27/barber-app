"use server";

import { prisma } from "@/lib/prisma";
import type { ReservationStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED"];

export async function deleteCustomerAction(customerId: string) {
  try {
    const activeReservations = await prisma.reservation.count({
      where: {
        customerId,
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
    });

    if (activeReservations > 0) {
      return {
        error: "No se puede eliminar un cliente con citas activas.",
      };
    }

    await prisma.customer.delete({
      where: { id: customerId },
    });

    revalidatePath("/admin/clientes");
    revalidatePath("/admin/historial");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      error: "No fue posible eliminar el cliente.",
    };
  }
}