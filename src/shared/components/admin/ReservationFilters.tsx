"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ReservationFilterStatus = "ALL" | "PENDING" | "CONFIRMED";

type ReservationFiltersProps = {
  status: ReservationFilterStatus;
  date: string;
  serviceId: string;
  services: Array<{ id: string; name: string }>;
};

function buildUrl(
  status: ReservationFilterStatus,
  date: string,
  serviceId: string,
  query: string | null,
) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (status !== "ALL") params.set("status", status);
  if (date) params.set("date", date);
  if (serviceId) params.set("serviceId", serviceId);

  const search = params.toString();
  return search ? `/admin/reservas?${search}` : "/admin/reservas";
}

export default function ReservationFilters({
  status,
  date,
  serviceId,
  services,
}: ReservationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [localStatus, setLocalStatus] = useState(status);
  const [localDate, setLocalDate] = useState(date);
  const [localServiceId, setLocalServiceId] = useState(serviceId);

  function applyFilters(
    nextStatus = localStatus,
    nextDate = localDate,
    nextServiceId = localServiceId,
  ) {
    router.replace(buildUrl(nextStatus, nextDate, nextServiceId, query));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters();
  }

  function handleClear() {
    setLocalStatus("ALL");
    setLocalDate("");
    setLocalServiceId("");
    router.replace(query ? `/admin/reservas?q=${encodeURIComponent(query)}` : "/admin/reservas");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Estado
          <select
            name="status"
            value={localStatus}
            onChange={(event) => {
              const nextStatus = event.target.value as ReservationFilterStatus;
              setLocalStatus(nextStatus);
              applyFilters(nextStatus, localDate, localServiceId);
            }}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          >
            <option value="ALL">Todas activas</option>
            <option value="PENDING">Pendientes</option>
            <option value="CONFIRMED">Confirmadas</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Fecha
          <input
            type="date"
            name="date"
            value={localDate}
            onChange={(event) => setLocalDate(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Servicio
          <select
            name="serviceId"
            value={localServiceId}
            onChange={(event) => {
              const nextServiceId = event.target.value;
              setLocalServiceId(nextServiceId);
              applyFilters(localStatus, localDate, nextServiceId);
            }}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          >
            <option value="">Todos los servicios</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#C8A96E] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#d8bb82]"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
}