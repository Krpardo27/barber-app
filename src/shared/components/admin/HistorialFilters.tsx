"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type HistorialStatus = "ALL" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

function buildUrl(status: HistorialStatus, from: string, to: string) {
  const params = new URLSearchParams();

  if (status && status !== "ALL") {
    params.set("status", status);
  }

  if (from) {
    params.set("from", from);
  }

  if (to) {
    params.set("to", to);
  }

  const query = params.toString();
  return query ? `/admin/historial?${query}` : "/admin/historial";
}

export default function HistorialFilters({
  selectedStatus,
  from,
  to,
}: {
  selectedStatus: HistorialStatus;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localFrom, setLocalFrom] = useState(from);
  const [localTo, setLocalTo] = useState(to);

  function handleStatusChange(nextStatus: HistorialStatus) {
    router.replace(buildUrl(nextStatus, localFrom, localTo));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const status = (searchParams.get("status") || "ALL") as HistorialStatus;
    router.replace(buildUrl(status, localFrom, localTo));
  }

  function handleClear() {
    setLocalFrom("");
    setLocalTo("");
    router.replace("/admin/historial");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Estado
          <select
            name="status"
            value={selectedStatus}
            onChange={(event) => handleStatusChange(event.target.value as HistorialStatus)}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          >
            <option value="ALL">Todos</option>
            <option value="CANCELLED">Canceladas</option>
            <option value="COMPLETED">Completadas</option>
            <option value="NO_SHOW">No asistió</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Desde
          <input
            type="date"
            name="from"
            value={localFrom}
            onChange={(event) => setLocalFrom(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs text-zinc-300">
          Hasta
          <input
            type="date"
            name="to"
            value={localTo}
            onChange={(event) => setLocalTo(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            Filtrar fechas
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
