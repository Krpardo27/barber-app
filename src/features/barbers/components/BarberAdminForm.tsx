"use client";

import {
  useActionState,
  useEffect,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiEdit3, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { Barber, BarberService, Service } from "@/generated/prisma/client";
import {
  createBarberAction,
  deleteBarberAction,
  updateBarberAction,
  type BarberActionState,
} from "../actions/barber-actions";

type BarberAdminFormProps = {
  barber?: Barber & {
    services?: Pick<BarberService, "serviceId" | "durationMin" | "isActive">[];
  };
  services?: Pick<Service, "id" | "name" | "durationMin">[];
  successRedirectHref?: string;
};

const initialBarberActionState: BarberActionState = {
  status: "idle",
  message: "",
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  let nationalNumber = digits;

  if (nationalNumber.startsWith("56")) {
    nationalNumber = nationalNumber.slice(2);
  }

  if (nationalNumber.startsWith("9")) {
    nationalNumber = nationalNumber.slice(1);
  }

  nationalNumber = nationalNumber.slice(0, 8);

  return `+569${nationalNumber}`;
}

function fieldError(state: BarberActionState, field: string) {
  return state.fieldErrors?.[field as keyof NonNullable<BarberActionState["fieldErrors"]>]?.[0];
}

function formValue(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() ?? "";
}

function barberServiceAssignment(
  barber: BarberAdminFormProps["barber"],
  serviceId: string,
) {
  return barber?.services?.find((service) => service.serviceId === serviceId);
}

function barberHasChanges(
  barber: NonNullable<BarberAdminFormProps["barber"]>,
  formData: FormData,
  services: NonNullable<BarberAdminFormProps["services"]>,
) {
  const isActive = formData.get("isActive") === "on";
  const serviceHasChanges = services.some((service) => {
    const assignment = barberServiceAssignment(barber, service.id);
    const defaultEnabled = assignment?.isActive ?? true;
    const defaultDuration = assignment?.durationMin ?? service.durationMin;
    const nextEnabled = formData.get(`serviceEnabled:${service.id}`) === "on";
    const nextDuration = Number(formData.get(`serviceDuration:${service.id}`) ?? defaultDuration);

    return nextEnabled !== defaultEnabled || nextDuration !== defaultDuration;
  });

  return (
    formValue(formData, "name") !== barber.name ||
    formValue(formData, "phone") !== (barber.phone ?? "") ||
    formValue(formData, "email") !== (barber.email ?? "") ||
    formValue(formData, "bio") !== (barber.bio ?? "") ||
    formValue(formData, "imageUrl") !== (barber.imageUrl ?? "") ||
    isActive !== barber.isActive ||
    serviceHasChanges
  );
}

function SubmitButton({ editing, pending }: { editing: boolean; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#C8A96E] px-4 text-xs font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-[#F5E6C8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {editing ? <FiSave className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
      {pending ? "Guardando..." : editing ? "Guardar" : "Crear"}
    </button>
  );
}

export default function BarberAdminForm({
  barber,
  services = [],
  successRedirectHref,
}: BarberAdminFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(barber?.phone ?? "+569");
  const [isPending, startTransition] = useTransition();
  const editing = Boolean(barber);
  const action = barber
    ? updateBarberAction.bind(null, barber.id)
    : createBarberAction;
  const [state, formAction] = useActionState(action, initialBarberActionState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (barber && !barberHasChanges(barber, formData, services)) {
      toast.warning("No se detectaron cambios en el barbero");
      return;
    }

    const result = await Swal.fire({
      title: editing ? "Guardar cambios" : "Crear barbero",
      text: editing
        ? "Se actualizaran los datos de este barbero."
        : "Se creara un nuevo barbero en el equipo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editing ? "Guardar cambios" : "Crear barbero",
      cancelButtonText: "Volver",
      confirmButtonColor: "#C8A96E",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) return;

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleDelete = async () => {
    if (!barber) return;

    const result = await Swal.fire({
      title: "Eliminar barbero",
      text: `Esta accion eliminara ${barber.name} del equipo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar barbero",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) return;

    startTransition(async () => {
      const response = await deleteBarberAction(barber.id);

      if (response.status === "success") {
        toast.success(response.message);
        router.push(successRedirectHref ?? "/admin/barberos");
        return;
      }

      toast.error(response.message);
    });
  };

  useEffect(() => {
    if (!state.message) return;

    if (state.status === "success") {
      toast.success(state.message);

      if (successRedirectHref) {
        router.push(successRedirectHref);
      }

      return;
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [router, state.message, state.status, successRedirectHref]);

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          {editing ? <FiEdit3 className="h-4 w-4 text-[#C8A96E]" /> : <FiPlus className="h-4 w-4 text-[#C8A96E]" />}
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            {editing ? "Editar barbero" : "Nuevo barbero"}
          </h3>
        </div>

        {barber?.isActive && (
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            Activo
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Nombre
          <input
            name="name"
            defaultValue={barber?.name ?? ""}
            minLength={2}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "name") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "name")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Telefono
          <input
            name="phone"
            type="tel"
            placeholder="+56912345678"
            maxLength={12}
            value={phone}
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            onKeyDown={(event) => {
              const allowed = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ];

              if (!allowed.includes(event.key) && !/^\d$/.test(event.key)) {
                event.preventDefault();
              }
            }}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "phone") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "phone")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Email
          <input
            name="email"
            type="email"
            defaultValue={barber?.email ?? ""}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "email") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "email")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Imagen URL
          <input
            name="imageUrl"
            defaultValue={barber?.imageUrl ?? ""}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "imageUrl") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "imageUrl")}</p>}
        </label>
      </div>

      <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Biografia
        <textarea
          name="bio"
          defaultValue={barber?.bio ?? ""}
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
        />
        {fieldError(state, "bio") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "bio")}</p>}
      </label>

      {services.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/30 p-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              Servicios y duracion
            </h4>
            <p className="mt-1 text-xs text-zinc-500">
              Desactiva servicios que este barbero no atiende o ajusta su duracion.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => {
              const assignment = barberServiceAssignment(barber, service.id);
              const defaultEnabled = assignment?.isActive ?? true;
              const defaultDuration = assignment?.durationMin ?? service.durationMin;

              return (
                <div
                  key={service.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3"
                >
                  <label className="flex items-start gap-3 text-sm text-white">
                    <input
                      name={`serviceEnabled:${service.id}`}
                      type="checkbox"
                      defaultChecked={defaultEnabled}
                      className="mt-1 h-4 w-4 accent-[#C8A96E]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{service.name}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        Base: {service.durationMin} min
                      </span>
                    </span>
                  </label>

                  <label className="mt-3 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Duracion del barbero
                    <input
                      name={`serviceDuration:${service.id}`}
                      type="number"
                      min={5}
                      max={480}
                      step={5}
                      defaultValue={defaultDuration}
                      className="mt-1 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-300">
          <input name="isActive" type="checkbox" defaultChecked={barber?.isActive ?? true} className="h-4 w-4 accent-[#C8A96E]" />
          Activo
        </label>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
          {barber && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 text-xs font-bold uppercase tracking-wide text-red-400 transition-colors hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <FiTrash2 className="h-4 w-4" />
              Eliminar barbero
            </button>
          )}

          <SubmitButton editing={editing} pending={isPending} />
        </div>
      </div>

      {state.message && (
        <p
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
            state.status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {state.status === "success" && <FiCheckCircle className="h-4 w-4" />}
          {state.message}
        </p>
      )}
    </form>
  );
}