"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import type { SheetData } from "write-excel-file/browser";

export type CompletedReservationExportRow = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  completedDate: string;
  durationMin: number;
  servicePrice: number;
};

type ExportCompletedReservationsButtonProps = {
  rows: CompletedReservationExportRow[];
  total: number;
  fileName: string;
};

export default function ExportCompletedReservationsButton({
  rows,
  total,
  fileName,
}: ExportCompletedReservationsButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (rows.length === 0 || isExporting) return;

    setIsExporting(true);

    try {
      const writeXlsxFile = (await import("write-excel-file/browser")).default;
      const headerStyle = {
        fontWeight: "bold" as const,
        backgroundColor: "#141414",
        textColor: "#FFFFFF",
      };

      const data: SheetData = [
        [
          { value: "Cliente", ...headerStyle },
          { value: "Telefono", ...headerStyle },
          { value: "Email", ...headerStyle },
          { value: "Servicio", ...headerStyle },
          { value: "Fecha cita", ...headerStyle },
          { value: "Completada", ...headerStyle },
          { value: "Duracion", ...headerStyle },
          { value: "Precio", ...headerStyle },
        ],
        ...rows.map((row) => [
          { value: row.customerName },
          { value: row.customerPhone },
          { value: row.customerEmail },
          { value: row.serviceName },
          { value: row.appointmentDate },
          { value: row.completedDate },
          { value: row.durationMin, type: Number },
          { value: row.servicePrice, type: Number, format: '"$"#,##0' },
        ]),
        [
          null,
          null,
          null,
          null,
          null,
          { value: "Total", fontWeight: "bold" as const },
          null,
          { value: total, type: Number, format: '"$"#,##0', fontWeight: "bold" as const },
        ],
      ];

      const file = await writeXlsxFile(data, {
        columns: [
          { width: 28 },
          { width: 16 },
          { width: 28 },
          { width: 28 },
          { width: 20 },
          { width: 20 },
          { width: 12 },
          { width: 14 },
        ],
      });

      await file.toFile(fileName);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={rows.length === 0 || isExporting}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#C8A96E]/30 px-4 text-xs font-bold uppercase tracking-wide text-[#C8A96E] transition-colors hover:border-[#F5E6C8]/60 hover:bg-[#C8A96E]/10 hover:text-[#F5E6C8] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <FiDownload className="h-4 w-4" />
      {isExporting ? "Exportando" : "Exportar Excel"}
    </button>
  );
}