"use client";

import { useEffect, useState } from "react";

export type Slot = {
  time: string;
  available: boolean;
};

export function useAvailableSlots(serviceId: string, date: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId || !date) return;

    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/slots?serviceId=${serviceId}&date=${date}`);
        const data = await res.json();
        setSlots(data.slots ?? []);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [serviceId, date]);

  return { slots, loading };
}