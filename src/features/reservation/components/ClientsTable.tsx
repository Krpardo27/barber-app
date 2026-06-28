"use client";

import { FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import { CancelReservationButton } from "../../../shared/components/admin/CancelReservationButton";
import DeleteCustomerButton from "../../../shared/components/admin/DeleteCustomerButton";
import WhatsAppButton from "../../../shared/components/admin/WhatsAppButton";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAtLabel: string;
  reservations: Array<{
    id: string;
    serviceName: string;
    startAtLabel: string;
    status: string;
  }>;
}

interface ClientsTableProps {
  customers: Customer[];
}

export default function ClientsTable({ customers }: ClientsTableProps) {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Reservas
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Registrado
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-300 whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((customer) => {
                const nextReservation = customer.reservations[0];

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center gap-2">
                        <FiPhone className="h-4 w-4 text-zinc-500 shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-4 w-4 text-zinc-500 shrink-0" />
                        <span>{customer.email || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                        <FiCalendar className="h-3 w-3 shrink-0" />
                        <span>{customer.reservations.length}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {customer.createdAtLabel}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {nextReservation ? (
                          <>
                            <WhatsAppButton
                              phone={customer.phone}
                              message={`💈 *Recordatorio de cita*
Hola ${customer.name}. Te recordamos que tu cita de *${nextReservation.serviceName}* está programada para el día *${nextReservation.startAtLabel}*.
¡Te esperamos! 😊`}
                              label="Recordar cita por whatsapp"
                            />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-zinc-400 whitespace-nowrap">
                                {nextReservation.startAtLabel}
                              </span>

                              <CancelReservationButton
                                reservationId={nextReservation.id}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <span className="text-xs text-zinc-500">
                              Sin cita activa
                            </span>
                            <DeleteCustomerButton
                              customerId={customer.id}
                              customerName={customer.name}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {customers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <p className="text-zinc-400">No hay clientes registrados aún.</p>
        </div>
      )}
    </>
  );
}
