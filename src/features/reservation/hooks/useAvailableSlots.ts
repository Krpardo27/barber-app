"use client";

import { useEffect, useState } from "react";

export type Slot = {
  time: string;
  available: boolean;
};

export function useAvailableSlots(serviceId: string, date: string, barberId?: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId || !date) return;

    const controller = new AbortController();

    async function fetchSlots() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ serviceId, date });

        if (barberId) {
          params.set("barberId", barberId);
        }

        const res = await fetch(`/api/slots?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setSlots(data.slots ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSlots([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSlots();

    return () => controller.abort();
  }, [serviceId, date, barberId]);

  return { slots, loading };
}