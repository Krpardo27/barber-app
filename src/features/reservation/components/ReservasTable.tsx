import { FiUser, FiPhone, FiClock, FiDollarSign } from "react-icons/fi";
import { CancelReservationButton } from "../../../shared/components/admin/CancelReservationButton";
import ReservationStatusButtons from "../../../shared/components/admin/ReservationStatusButtons";
import WhatsAppButton from "../../../shared/components/admin/WhatsAppButton";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Reservation {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  durationMin: number;
  startAt: Date;
  endAt: Date;
  notes: string | null;
  status: string;
  cancelledAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  service: Service;
}

interface ReservasTableProps {
  reservations: Reservation[];
  showCancelAction?: boolean;
  showStatusActions?: boolean;
  showWhatsAppAction?: boolean;
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    CANCELLED: "bg-red-500/10 text-red-400",
    COMPLETED: "bg-blue-500/10 text-blue-400",
    NO_SHOW: "bg-orange-500/10 text-orange-400",
  };
  return colors[status as keyof typeof colors] || "bg-zinc-500/10 text-zinc-400";
};

export default function ReservasTable({
  reservations,
  showCancelAction = false,
  showStatusActions = false,
  showWhatsAppAction = false,
}: ReservasTableProps) {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Cliente</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Teléfono</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Servicio</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Fecha y Hora</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Duración</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Precio</th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Estado</th>
                {(showCancelAction || showStatusActions || showWhatsAppAction) && (
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{reservation.customer?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{reservation.customer?.phone || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{reservation.serviceName || "N/A"}</td>
                  <td className="px-6 py-4 text-white">
                    {new Date(reservation.startAt).toLocaleString("es-CL", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-white">
                    <div className="flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{reservation.durationMin}m</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    <div className="flex items-center gap-1">
                      <FiDollarSign className="h-4 w-4 text-[#C8A96E] shrink-0" />
                      <span>{reservation.servicePrice.toLocaleString("es-CL")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  {(showCancelAction || showStatusActions || showWhatsAppAction) && (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {showWhatsAppAction && (
                          <WhatsAppButton
                            phone={reservation.customer?.phone}
                            message={`Hola ${reservation.customer?.name || ""}, te escribimos por tu reserva de ${reservation.serviceName} en la barberia.`}
                            label="Contactar"
                          />
                        )}
                        {showStatusActions && (
                          <ReservationStatusButtons reservationId={reservation.id} />
                        )}
                        {showCancelAction && (
                          <CancelReservationButton reservationId={reservation.id} />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reservations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <p className="text-zinc-400">No hay reservas registradas.</p>
        </div>
      )}
    </>
  );
}
