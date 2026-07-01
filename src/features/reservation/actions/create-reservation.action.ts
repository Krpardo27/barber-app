"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReservationSchema } from "../schemas/reservation.schema";
import {
  findAvailableBarber,
  getActiveService,
  getDurationForBarber,
  hasReservationConflict,
  isInsideBusinessHours,
  OPEN_HOUR,
} from "../services/availability";

type CreateReservationActionResult =
  | { errors: Array<{ message: string }>; data?: never; success?: false }
  | { success: true; data: { reservationId: string }; errors?: never };

type ReservationTransactionResult =
  | { errors: Array<{ message: string }>; reservationId?: never }
  | { reservationId: string; errors?: never };

export async function createReservationAction(
  data: unknown,
): Promise<CreateReservationActionResult> {
  const result = ReservationSchema.safeParse(data);

  if (!result.success) {
    return { errors: result.error.issues };
  }

  const {
    serviceId,
    barberId,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    startAt,
    notes,
  } = result.data;
  const normalizedCustomerEmail = customerEmail || null;

  try {
    const reservation = await prisma.$transaction(async (tx): Promise<ReservationTransactionResult> => {
      const service = await getActiveService(tx, serviceId);

      if (!service) {
        return {
          errors: [{ message: "El servicio seleccionado no está disponible." }],
        };
      }

      const start = new Date(startAt!);

      if (Number.isNaN(start.getTime()) || start.getHours() < OPEN_HOUR) {
        return {
          errors: [{ message: "Selecciona una fecha y hora válida." }],
        };
      }

      const lockKey = `reservation:${startAt!.slice(0, 10)}`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      let resolvedBarberId = barberId || null;
      let resolvedDurationMin: number | null = null;

      if (resolvedBarberId) {
        resolvedDurationMin = await getDurationForBarber(tx, service, resolvedBarberId);

        if (!resolvedDurationMin) {
          return {
            errors: [{ message: "El barbero seleccionado no atiende este servicio." }],
          };
        }
      } else {
        const availableBarber = await findAvailableBarber(tx, { service, start });

        if (!availableBarber) {
          return {
            errors: [{ message: "No hay barberos disponibles para ese horario." }],
          };
        }

        resolvedBarberId = availableBarber.barberId;
        resolvedDurationMin = availableBarber.durationMin;
      }

      const end = new Date(start.getTime() + resolvedDurationMin * 60 * 1000);

      if (!isInsideBusinessHours(end)) {
        return {
          errors: [{ message: "Ese horario termina fuera del horario de atención." }],
        };
      }

      const conflict = await hasReservationConflict(tx, {
        barberId: resolvedBarberId,
        start,
        end,
      });

      if (conflict) {
        return {
          errors: [{ message: "Ese horario ya está reservado, elige otro." }],
        };
      }

      let resolvedCustomerId = customerId;

      if (normalizedCustomerEmail) {
        const existingEmailCustomer = await tx.customer.findFirst({
          where: { email: normalizedCustomerEmail },
          select: { id: true, phone: true },
        });
        const isSameSelectedCustomer = existingEmailCustomer?.id === resolvedCustomerId;
        const isSamePhoneCustomer = existingEmailCustomer?.phone === customerPhone;

        if (existingEmailCustomer && !isSameSelectedCustomer && !isSamePhoneCustomer) {
          return {
            errors: [{ message: "Ese correo ya está registrado con otro cliente." }],
          };
        }
      }

      if (!resolvedCustomerId && customerPhone) {
        const customer = await tx.customer.upsert({
          where: { phone: customerPhone },
          update: {},
          create: {
            name: customerName!,
            phone: customerPhone,
            email: normalizedCustomerEmail,
          },
          select: { id: true },
        });

        resolvedCustomerId = customer.id;
      }

      if (!resolvedCustomerId) {
        return {
          errors: [{ message: "No se pudo identificar al cliente." }],
        };
      }

      const createdReservation = await tx.reservation.create({
        data: {
          customerId: resolvedCustomerId,
          serviceId: service.id,
          barberId: resolvedBarberId,
          serviceName: service.name,
          servicePrice: service.price,
          durationMin: resolvedDurationMin,
          startAt: start,
          endAt: end,
          notes: notes || null,
        },
      });

      return { reservationId: createdReservation.id };
    });

    if (reservation.errors) {
      return reservation;
    }

    revalidatePath("/admin/agenda");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");
    revalidatePath("/reservar");
    return {
      success: true,
      data: {
        reservationId: reservation.reservationId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      errors: [{ message: "Error al crear la reserva. Intenta de nuevo." }],
    };
  }
}
