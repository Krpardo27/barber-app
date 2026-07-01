import type { PrismaClient } from "@/generated/prisma/client";
import { ReservationStatus } from "@/generated/prisma/enums";

export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 19;
export const SLOT_INTERVAL_MINUTES = 30;

const ACTIVE_RESERVATION_STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
];

type AvailabilityClient = Pick<
  PrismaClient,
  "service" | "barber" | "reservation" | "barberService"
>;

type ServiceSnapshot = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
};

type BarberCandidate = {
  id: string;
  name?: string;
  services: Array<{
    durationMin: number | null;
    isActive: boolean;
  }>;
};

export type AvailableBarber = {
  barberId: string;
  barberName: string;
  durationMin: number;
};

export function getDayRange(date: string) {
  return {
    dayStart: new Date(`${date}T00:00:00`),
    dayEnd: new Date(`${date}T23:59:59.999`),
  };
}

function getCandidateDuration(service: ServiceSnapshot, barber: BarberCandidate) {
  const assignment = barber.services[0];

  if (assignment?.isActive === false) {
    return null;
  }

  return assignment?.durationMin ?? service.durationMin;
}

export async function getActiveService(db: AvailabilityClient, serviceId: string) {
  return db.service.findFirst({
    where: { id: serviceId, isActive: true },
    select: { id: true, name: true, price: true, durationMin: true },
  });
}

export async function getDurationForBarber(
  db: AvailabilityClient,
  service: ServiceSnapshot,
  barberId: string,
) {
  const barber = await db.barber.findFirst({
    where: { id: barberId, isActive: true },
    select: {
      id: true,
      services: {
        where: { serviceId: service.id },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  if (!barber) return null;

  return getCandidateDuration(service, barber);
}

export async function hasReservationConflict(
  db: AvailabilityClient,
  params: { barberId: string; start: Date; end: Date; excludeReservationId?: string },
) {
  const conflict = await db.reservation.findFirst({
    where: {
      barberId: params.barberId,
      status: { in: ACTIVE_RESERVATION_STATUSES },
      ...(params.excludeReservationId ? { id: { not: params.excludeReservationId } } : {}),
      OR: [{ startAt: { lt: params.end }, endAt: { gt: params.start } }],
    },
    select: { id: true },
  });

  return Boolean(conflict);
}

export async function findAvailableBarber(
  db: AvailabilityClient,
  params: { service: ServiceSnapshot; start: Date },
): Promise<AvailableBarber | null> {
  const barbers = await db.barber.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      services: {
        where: { serviceId: params.service.id },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  for (const barber of barbers) {
    const durationMin = getCandidateDuration(params.service, barber);

    if (!durationMin) continue;

    const end = new Date(params.start.getTime() + durationMin * 60 * 1000);
    const hasConflict = await hasReservationConflict(db, {
      barberId: barber.id,
      start: params.start,
      end,
    });

    if (!hasConflict) {
      return { barberId: barber.id, barberName: barber.name, durationMin };
    }
  }

  return null;
}

export async function getAvailabilityCandidates(
  db: AvailabilityClient,
  service: ServiceSnapshot,
  barberId?: string,
) {
  if (barberId) {
    const durationMin = await getDurationForBarber(db, service, barberId);

    return durationMin
      ? [{ barberId, durationMin }]
      : [];
  }

  const barbers = await db.barber.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      services: {
        where: { serviceId: service.id },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  return barbers.flatMap((barber) => {
    const durationMin = getCandidateDuration(service, barber);

    return durationMin ? [{ barberId: barber.id, durationMin }] : [];
  });
}

export function isInsideBusinessHours(slotEnd: Date) {
  return !(
    slotEnd.getHours() > CLOSE_HOUR ||
    (slotEnd.getHours() === CLOSE_HOUR && slotEnd.getMinutes() > 0)
  );
}