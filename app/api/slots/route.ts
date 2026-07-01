import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getActiveService,
  getAvailabilityCandidates,
  getDayRange,
  hasReservationConflict,
  isInsideBusinessHours,
  CLOSE_HOUR,
  OPEN_HOUR,
  SLOT_INTERVAL_MINUTES,
} from "@/features/reservation/services/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const serviceId = searchParams.get("serviceId");
  const barberId = searchParams.get("barberId") || undefined;
  const date = searchParams.get("date"); // "2026-06-15"

  if (!serviceId || !date) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const service = await getActiveService(prisma, serviceId);
  if (!service) {
    return NextResponse.json(
      { error: "Servicio no encontrado" },
      { status: 404 },
    );
  }

  const candidates = await getAvailabilityCandidates(prisma, service, barberId);

  if (candidates.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  // Reservas del día con estado activo
  const { dayStart, dayEnd } = getDayRange(date);

  // Generar slots cada 30 min dentro del horario
  const slots = [];
  const totalMinutes = (CLOSE_HOUR - OPEN_HOUR) * 60;

  for (let i = 0; i < totalMinutes; i += SLOT_INTERVAL_MINUTES) {
    const slotStart = new Date(`${date}T00:00:00`);
    slotStart.setHours(OPEN_HOUR, i, 0, 0);

    if (slotStart < new Date()) continue;

    const availabilityByCandidate = await Promise.all(
      candidates.map(async (candidate) => {
        const slotEnd = new Date(slotStart.getTime() + candidate.durationMin * 60 * 1000);

        if (!isInsideBusinessHours(slotEnd)) {
          return false;
        }

        if (slotStart < dayStart || slotEnd > dayEnd) {
          return false;
        }

        return !(await hasReservationConflict(prisma, {
          barberId: candidate.barberId,
          start: slotStart,
          end: slotEnd,
        }));
      }),
    );
    const isAvailable = availabilityByCandidate.some(Boolean);

    const hours = String(slotStart.getHours()).padStart(2, "0");
    const minutes = String(slotStart.getMinutes()).padStart(2, "0");

    slots.push({
      time: `${hours}:${minutes}`,
      available: isAvailable,
    });
  }

  return NextResponse.json({ slots });
}
