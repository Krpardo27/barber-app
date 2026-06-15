import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Horarios de la barbería: 9:00 a 19:00
const OPEN_HOUR = 9;
const CLOSE_HOUR = 19;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date"); // "2026-06-15"

  if (!serviceId || !date) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json(
      { error: "Servicio no encontrado" },
      { status: 404 },
    );
  }

  // Reservas del día con estado activo
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const reservations = await prisma.reservation.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { gte: dayStart, lte: dayEnd },
    },
    select: { startAt: true, endAt: true },
  });

  // Generar slots cada 30 min dentro del horario
  const slots = [];
  const slotDuration = 30; // minutos entre slots
  const totalMinutes = (CLOSE_HOUR - OPEN_HOUR) * 60;

  for (let i = 0; i < totalMinutes; i += slotDuration) {
    const slotStart = new Date(`${date}T00:00:00`);
    slotStart.setHours(OPEN_HOUR, i, 0, 0);
    const slotEnd = new Date(
      slotStart.getTime() + service.durationMin * 60 * 1000,
    );

    // No mostrar slots que terminarían después del cierre
    if (
      slotEnd.getHours() > CLOSE_HOUR ||
      (slotEnd.getHours() === CLOSE_HOUR && slotEnd.getMinutes() > 0)
    ) {
      continue;
    }

    // No mostrar slots pasados
    if (slotStart < new Date()) continue;

    // Verificar colisión con reservas existentes
    const isOccupied = reservations.some(
      (r) => slotStart < r.endAt && slotEnd > r.startAt,
    );

    const hours = String(slotStart.getHours()).padStart(2, "0");
    const minutes = String(slotStart.getMinutes()).padStart(2, "0");

    slots.push({
      time: `${hours}:${minutes}`,
      available: !isOccupied,
    });
  }

  return NextResponse.json({ slots });
}
