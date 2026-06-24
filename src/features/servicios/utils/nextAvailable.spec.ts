import { describe, it, expect, beforeEach } from "vitest";
import { getNextAvailableSlot } from "./nextAvailable";

describe("getNextAvailableSlot", () => {
  let day: Date;
  let now: Date;

  beforeEach(() => {
    // Usar UTC para evitar problemas de zona horaria
    day = new Date(Date.UTC(2026, 5, 16, 0, 0, 0));
    now = new Date(Date.UTC(2026, 5, 16, 9, 0, 0));
  });

  it("retorna null si no hay slots disponibles", () => {
    const result = getNextAvailableSlot({
      day,
      now,
      durationMin: 120,
      reservations: [
        {
          startAt: new Date(Date.UTC(2026, 5, 16, 9, 0, 0)),
          endAt: new Date(Date.UTC(2026, 5, 16, 11, 0, 0)),
        },
        {
          startAt: new Date(Date.UTC(2026, 5, 16, 11, 0, 0)),
          endAt: new Date(Date.UTC(2026, 5, 16, 13, 0, 0)),
        },
      ],
      openHour: 9,
      closeHour: 13,
      slotStepMin: 30,
    });

    expect(result).toBeNull();
  });

  it("retorna el primer slot disponible sin colisiones", () => {
    const result = getNextAvailableSlot({
      day,
      now,
      durationMin: 30,
      reservations: [
        {
          startAt: new Date(Date.UTC(2026, 5, 16, 9, 30, 0)),
          endAt: new Date(Date.UTC(2026, 5, 16, 10, 30, 0)),
        },
      ],
      openHour: 9,
      closeHour: 19,
      slotStepMin: 30,
    });

    expect(result).toEqual(new Date(Date.UTC(2026, 5, 16, 9, 0, 0)));
  });

  it("salta slots en el pasado", () => {
    now = new Date(Date.UTC(2026, 5, 16, 10, 0, 0));

    const result = getNextAvailableSlot({
      day,
      now,
      durationMin: 30,
      reservations: [],
      openHour: 9,
      closeHour: 19,
      slotStepMin: 30,
    });

    expect(result?.getUTCHours()).toEqual(10);
    expect(result?.getUTCMinutes()).toEqual(0);
  });

  it("no retorna slots que terminan después del cierre", () => {
    const result = getNextAvailableSlot({
      day,
      now,
      durationMin: 120,
      reservations: [],
      openHour: 9,
      closeHour: 19,
      slotStepMin: 30,
    });

    expect(result?.getUTCHours()).toBeLessThan(19);
  });

  it("detecta colisiones parciales correctamente", () => {
    const result = getNextAvailableSlot({
      day,
      now,
      durationMin: 60,
      reservations: [
        {
          startAt: new Date(Date.UTC(2026, 5, 16, 9, 30, 0)),
          endAt: new Date(Date.UTC(2026, 5, 16, 10, 15, 0)),
        },
      ],
      openHour: 9,
      closeHour: 19,
      slotStepMin: 30,
    });

    expect(result).toEqual(new Date(Date.UTC(2026, 5, 16, 10, 30, 0)));
  });
});
