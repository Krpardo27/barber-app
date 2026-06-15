'use client'

import { useStore } from "@/store";

export default function ReservationSummary() {
  const selectedService = useStore(
    (state) => state.activeService
  );

  return (
    <div>
      {!selectedService ? (
        <p>Vacío</p>
      ) : (
        <div>
          <p>{selectedService.name}</p>
          <p>{selectedService.price}</p>
        </div>
      )}
    </div>
  );
}