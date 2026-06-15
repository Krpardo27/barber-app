"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationSchema, type ReservationFormData } from "../schemas/reservation.schema";
import { createReservationAction } from "../actions/create-reservation.action";
import SlotPicker from "./SlotPicker";
import CustomerFields from "./CustomerFields";
import type { Service } from "@/generated/prisma/client";

type Props = {
  services: Service[];
  defaultServiceId?: string;
};

export default function ReservationForm({ services, defaultServiceId }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? "",
    },
  });

  const serviceId = watch("serviceId");
  const startAt = watch("startAt");
  const selectedService = services.find((s) => s.id === serviceId);

  const onSubmit = async (data: ReservationFormData) => {
    setServerError(null);
    const result = await createReservationAction(data);

    if (result.errors) {
      setServerError(result.errors[0]?.message ?? "Error desconocido");
      return;
    }

    const { customerName, customerPhone, serviceName, servicePrice, startAt: iso, durationMin } = result.data!;
    const params = new URLSearchParams({
      name: customerName,
      phone: customerPhone ?? "",
      service: serviceName,
      price: String(servicePrice),
      startAt: iso,
      duration: String(durationMin),
    });
    router.push(`/reservar/confirmacion?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* SERVICIO */}
      <div>
        <label className="text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
          Servicio
        </label>
        <select
          {...register("serviceId")}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
        >
          <option value="">Selecciona un servicio</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — ${s.price.toLocaleString("es-CL")} ({s.durationMin} min)
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="text-red-400 text-xs mt-1">{errors.serviceId.message}</p>
        )}
      </div>

      {/* FECHA Y HORA */}
      {serviceId && (
        <SlotPicker
          serviceId={serviceId}
          value={startAt ?? ""}
          onChange={(iso) => setValue("startAt", iso)}
        />
      )}
      {errors.startAt && (
        <p className="text-red-400 text-xs -mt-6">{errors.startAt.message}</p>
      )}

      {/* CLIENTE */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Datos del cliente</p>
        <CustomerFields register={register} setValue={setValue} errors={errors}/>
      </div>

      {/* NOTAS */}
      <div>
        <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
          Notas (opcional)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Alguna indicación especial..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-[#C8A96E]"
        />
      </div>

      {/* RESUMEN RÁPIDO */}
      {selectedService && startAt && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl px-5 py-4 space-y-1">
          <p className="text-[#C8A96E] text-xs uppercase tracking-widest font-bold">Resumen</p>
          <p className="text-white text-sm">{selectedService.name}</p>
          <p className="text-zinc-400 text-xs">
            {new Date(startAt).toLocaleString("es-CL", {
              weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
            })}
          </p>
          <p className="text-[#C8A96E] font-semibold text-sm">
            ${selectedService.price.toLocaleString("es-CL")}
          </p>
        </div>
      )}

      {serverError && (
        <p className="text-red-400 text-sm text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-[#C8A96E] text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-[#F5E6C8] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
      </button>
    </form>
  );
}