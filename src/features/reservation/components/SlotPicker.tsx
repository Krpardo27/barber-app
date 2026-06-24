"use client";

import { useState } from "react";
import { useAvailableSlots } from "../hooks/useAvailableSlots";

type Props = {
  serviceId: string;
  value: string;
  onChange: (isoString: string) => void;
};

export default function SlotPicker({ serviceId, value, onChange }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const { slots, loading } = useAvailableSlots(serviceId, selectedDate);

  const handleSlot = (time: string) => {
    onChange(`${selectedDate}T${time}:00`);
  };

  const selectedTime = value?.split("T")[1]?.slice(0, 5);

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
        <label className="text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
          Hora disponible
        </label>
        {loading ? (
          <p className="text-zinc-500 text-sm">Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p className="text-zinc-500 text-sm">No hay horarios disponibles para este día.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => handleSlot(slot.time)}
                className={`
                  rounded-lg px-3 py-2 text-sm font-medium transition-all border
                  ${!slot.available
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