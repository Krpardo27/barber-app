"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReservationSchema, type ReservationFormData } from "../schemas/reservation.schema";
import { createReservationAction } from "../actions/create-reservation.action";
import SlotPicker from "./SlotPicker";
import CustomerFields from "./CustomerFields";
import type { Barber, BarberService, Service } from "@/generated/prisma/client";

type ReservationBarber = Barber & {
  services?: Pick<BarberService, "serviceId" | "durationMin" | "isActive">[];
};

type Props = {
  services: Service[];
  barbers: ReservationBarber[];
  defaultServiceId?: string;
};

function getBarberServiceConfig(barber: ReservationBarber | undefined, serviceId: string) {
  return barber?.services?.find((service) => service.serviceId === serviceId);
}

export default function ReservationForm({ services, barbers, defaultServiceId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? "",
      barberId: "",
      customerMode: "search",
    },
  });

  const serviceId = useWatch({ control, name: "serviceId" });
  const barberId = useWatch({ control, name: "barberId" });
  const startAt = useWatch({ control, name: "startAt" });
  const selectedBarber = barbers.find((barber) => barber.id === barberId);
  const serviceOptions = selectedBarber
    ? services.filter((service) => {
        const config = getBarberServiceConfig(selectedBarber, service.id);
        return config?.isActive !== false;
      })
    : services;
  const selectedService = services.find((s) => s.id === serviceId);
  const serviceField = register("serviceId");

  const syncServiceUrl = useCallback((nextServiceId: string) => {
    const nextService = services.find((service) => service.id === nextServiceId);
    const params = new URLSearchParams(searchParams.toString());

    params.delete("serviceId");
    if (nextService) {
      params.set("servicio", nextService.slug);
    } else {
      params.delete("servicio");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams, services]);

  useEffect(() => {
    const selectedServiceIsAvailable = selectedBarber
      ? services.some((service) => {
          const config = getBarberServiceConfig(selectedBarber, service.id);
          return service.id === serviceId && config?.isActive !== false;
        })
      : services.some((service) => service.id === serviceId);

    if (!serviceId || !selectedServiceIsAvailable) {
      const nextServiceId = serviceOptions[0]?.id ?? "";

      setValue("serviceId", nextServiceId);
      setValue("startAt", "");
      syncServiceUrl(nextServiceId);
    }
  }, [selectedBarber, serviceId, serviceOptions, services, setValue, syncServiceUrl]);

  const onSubmit = async (data: ReservationFormData) => {
    setServerError(null);
    const result = await createReservationAction(data);

    if (result.errors) {
      setServerError(result.errors[0]?.message ?? "Error desconocido");
      return;
    }

    const params = new URLSearchParams({ id: result.data!.reservationId });
    router.push(`/reservar/confirmacion?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* BARBERO */}
      {barbers.length > 0 && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-400">
            Barbero
          </label>
          <select
            {...register("barberId", {
              onChange: () => setValue("startAt", ""),
            })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-[#C8A96E] focus:outline-none"
          >
            <option value="">Cualquier barbero disponible</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SERVICIO */}
      <div>
        <label className="text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
          Servicio
        </label>
        <select
          {...serviceField}
          onChange={(event) => {
            serviceField.onChange(event);
            setValue("startAt", "");
            syncServiceUrl(event.target.value);
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
        >
          <option value="">Selecciona un servicio</option>
          {serviceOptions.map((service) => {
            const config = getBarberServiceConfig(selectedBarber, service.id);
            const durationMin = config?.durationMin ?? service.durationMin;

            return (
              <option key={service.id} value={service.id}>
                {service.name} — ${service.price.toLocaleString("es-CL")} ({durationMin} min)
              </option>
            );
          })}
        </select>
        {errors.serviceId && (
          <p className="text-red-400 text-xs mt-1">{errors.serviceId.message}</p>
        )}
      </div>

      {/* FECHA Y HORA */}
      {serviceId && (
        <SlotPicker
          serviceId={serviceId}
          barberId={barberId || undefined}
          value={startAt ?? ""}
          onChange={(iso) => setValue("startAt", iso)}
        />
      )}
      {serviceId && errors.startAt && (
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
        className="w-full py-4 rounded-2xl bg-[#C8A96E] cursor-pointer text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-[#F5E6C8] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
      </button>
    </form>
  );
}