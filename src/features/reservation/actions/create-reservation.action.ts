"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReservationSchema } from "../schemas/reservation.schema";

export async function createReservationAction(data: unknown) {
  const result = ReservationSchema.safeParse(data);

  if (!result.success) {
    return { errors: result.error.issues };
  }

  const {
    serviceId,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    startAt,
    notes,
  } = result.data;

  try {
    const service = await prisma.service.findUniqueOrThrow({
      where: { id: serviceId },
    });

    const start = new Date(startAt!);
    const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

    // Verificar colisión de horario
    const conflict = await prisma.reservation.findFirst({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [{ startAt: { lt: end }, endAt: { gt: start } }],
      },
    });

    if (conflict) {
      return {
        errors: [{ message: "Ese horario ya está reservado, elige otro." }],
      };
    }

    // Resolver cliente — siempre buscar primero por teléfono
    let resolvedCustomerId = customerId;

    if (!resolvedCustomerId && customerPhone) {
      const existing = await prisma.customer.findUnique({
        where: { phone: customerPhone },
      });

      if (existing) {
        // Cliente ya existe → reusar sin error
        resolvedCustomerId = existing.id;
      } else {
        const created = await prisma.customer.create({
          data: {
            name: customerName!,
            phone: customerPhone,
            email: customerEmail || null,
          },
        });
        resolvedCustomerId = created.id;
      }
    }

    if (!resolvedCustomerId) {
      return {
        errors: [{ message: "No se pudo identificar al cliente." }],
      };
    }

    const reservation = await prisma.reservation.create({
      data: {
        customerId: resolvedCustomerId,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        durationMin: service.durationMin,
        startAt: start,
        endAt: end,
        notes: notes || null,
      },
    });

    revalidatePath("/reservar");
    return {
      success: true,
      data: {
        reservationId: reservation.id,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      errors: [{ message: "Error al crear la reserva. Intenta de nuevo." }],
    };
  }
}
