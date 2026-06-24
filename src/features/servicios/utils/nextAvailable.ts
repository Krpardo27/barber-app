type TimeRange = {
  startAt: Date;
  endAt: Date;
};

type NextAvailableInput = {
  day: Date;
  now: Date;
  durationMin: number;
  reservations: TimeRange[];
  openHour?: number;
  closeHour?: number;
  slotStepMin?: number;
};

export function getNextAvailableSlot({
  day,
  now,
  durationMin,
  reservations,
  openHour = 9,
  closeHour = 19,
  slotStepMin = 30,
}: NextAvailableInput): Date | null {
  // Usar UTC para evitar problemas de zona horaria
  const dayStart = new Date(day);
  dayStart.setUTCHours(openHour, 0, 0, 0);

  const dayClose = new Date(day);
  dayClose.setUTCHours(closeHour, 0, 0, 0);

  for (let offsetMin = 0; offsetMin < (closeHour - openHour) * 60; offsetMin += slotStepMin) {
    const slotStart = new Date(dayStart.getTime() + offsetMin * 60 * 1000);
    const slotEnd = new Date(slotStart.getTime() + durationMin * 60 * 1000);

    if (slotStart < now) {
      continue;
    }

    if (slotEnd > dayClose) {
      continue;
    }

    const isOccupied = reservations.some(
      (reservation) => slotStart < reservation.endAt && slotEnd > reservation.startAt
    );

    if (!isOccupied) {
      return slotStart;
    }
  }

  return null;
}
