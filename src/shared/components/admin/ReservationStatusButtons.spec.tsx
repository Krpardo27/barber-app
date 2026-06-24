import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ReservationStatusButtons from "./ReservationStatusButtons";
import { updateReservationStatusAction } from "@/features/reservation/actions/update-reservation-status.action";
import Swal from "sweetalert2";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock("@/features/reservation/actions/update-reservation-status.action", () => ({
  updateReservationStatusAction: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("ReservationStatusButtons", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    refreshMock.mockReset();
    vi.mocked(updateReservationStatusAction).mockReset();
    vi.mocked(Swal.fire).mockReset();
  });

  it("marca cita como completada cuando se confirma", async () => {
    vi.mocked(Swal.fire)
      .mockResolvedValueOnce({ isConfirmed: true } as never)
      .mockResolvedValueOnce({} as never);
    vi.mocked(updateReservationStatusAction).mockResolvedValue({ success: true });

    render(<ReservationStatusButtons reservationId="res_1" />);

    fireEvent.click(screen.getByRole("button", { name: "Completada" }));

    await waitFor(() => {
      expect(updateReservationStatusAction).toHaveBeenCalledWith("res_1", "COMPLETED");
    });

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledTimes(2);
  });

  it("no actualiza si el usuario cancela la confirmación", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as never);

    render(<ReservationStatusButtons reservationId="res_2" />);

    fireEvent.click(screen.getByRole("button", { name: "No asistió" }));

    await waitFor(() => {
      expect(updateReservationStatusAction).not.toHaveBeenCalled();
    });

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("muestra error y no refresca cuando la acción falla", async () => {
    vi.mocked(Swal.fire)
      .mockResolvedValueOnce({ isConfirmed: true } as never)
      .mockResolvedValueOnce({} as never);
    vi.mocked(updateReservationStatusAction).mockResolvedValue({
      error: "Error de prueba",
    });

    render(<ReservationStatusButtons reservationId="res_3" />);

    fireEvent.click(screen.getByRole("button", { name: "No asistió" }));

    await waitFor(() => {
      expect(updateReservationStatusAction).toHaveBeenCalledWith("res_3", "NO_SHOW");
    });

    expect(refreshMock).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledTimes(2);
    expect(vi.mocked(Swal.fire).mock.calls[1]?.[0]).toMatchObject({
      title: "No se pudo actualizar",
      icon: "error",
    });
  });
});
