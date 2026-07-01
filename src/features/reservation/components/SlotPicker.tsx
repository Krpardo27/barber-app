"use client";

import { useState } from "react";
import { useAvailableSlots } from "../hooks/useAvailableSlots";

type Props = {
  serviceId: string;
  barberId?: string;
  value: string;
  onChange: (isoString: string) => void;
};

export default function SlotPicker({ serviceId, barberId, value, onChange }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const { slots, loading } = useAvailableSlots(serviceId, selectedDate, barberId);

  const handleSlot = (time: string) => {
    onChange(`${selectedDate}T${time}:00`);
  };

  const selectedTime = value?.split("T")[1]?.slice(0, 5);
  const showInitialLoading = loading && slots.length === 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
          Fecha
        </label>
        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            onChange("");
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-400">
          Hora disponible
        </label>

        {showInitialLoading ? (
          <div className="grid min-h-24 grid-cols-4 gap-2" aria-label="Actualizando horarios">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/70"
              />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex min-h-24 items-center rounded-xl border border-dashed border-zinc-800 px-4 text-sm text-zinc-500">
            No hay horarios disponibles para este día.
          </div>
        ) : (
          <div className="grid min-h-24 grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={loading || !slot.available}
                onClick={() => handleSlot(slot.time)}
                className={`
                  rounded-lg px-3 py-2 text-sm font-medium transition-all border
                  ${loading
                    ? "cursor-wait opacity-50 border-zinc-800 text-zinc-500"
                    : !slot.available
                    ? "opacity-30 cursor-not-allowed border-zinc-800 text-zinc-600"
                    : selectedTime === slot.time
                      ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#F5E6C8]"
                      : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}