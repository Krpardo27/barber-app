import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HistorialFilters from "./HistorialFilters";

const replaceMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => searchParams,
}));

describe("HistorialFilters", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    replaceMock.mockReset();
    searchParams = new URLSearchParams();
  });

  it("actualiza de inmediato al cambiar estado", () => {
    render(<HistorialFilters selectedStatus="ALL" from="" to="" />);

    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "COMPLETED" },
    });

    expect(replaceMock).toHaveBeenCalledWith("/admin/historial?status=COMPLETED");
  });

  it("aplica filtro de fechas conservando estado actual", () => {
    searchParams = new URLSearchParams("status=NO_SHOW");

    render(
      <HistorialFilters
        selectedStatus="NO_SHOW"
        from="2026-06-10"
        to="2026-06-16"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Filtrar fechas" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/admin/historial?status=NO_SHOW&from=2026-06-10&to=2026-06-16"
    );
  });

  it("limpia todos los filtros y vuelve a historial base", () => {
    render(
      <HistorialFilters
        selectedStatus="CANCELLED"
        from="2026-06-10"
        to="2026-06-16"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(replaceMock).toHaveBeenCalledWith("/admin/historial");
  });
});
