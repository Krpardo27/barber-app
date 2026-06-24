"use client";

import { useActionState, useEffect, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiEdit3, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "sonner";
import type { Category, Service } from "@/generated/prisma/client";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "../actions/service-actions";
import type { ServiceActionState } from "../actions/service-actions";

type ServiceAdminFormProps = {
  categories: Pick<Category, "id" | "name">[];
  service?: Service;
  successRedirectHref?: string;
};

const initialServiceActionState: ServiceActionState = {
  status: "idle",
  message: "",
};

function fieldError(state: ServiceActionState, field: string) {
  return state.fieldErrors?.[field as keyof NonNullable<ServiceActionState["fieldErrors"]>]?.[0];
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

function formValue(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() ?? "";
}

function serviceHasChanges(service: Service, formData: FormData) {
  const featured = formData.get("featured") === "on";
  const isActive = formData.get("isActive") === "on";

  return (
    formValue(formData, "name") !== service.name ||
    formValue(formData, "description") !== (service.description ?? "") ||
    Number(formValue(formData, "price")) !== service.price ||
    Number(formValue(formData, "durationMin")) !== service.durationMin ||
    formValue(formData, "categoryId") !== service.categoryId ||
    featured !== service.featured ||
    isActive !== service.isActive
  );
}

export default function ServiceAdminForm({ categories, service, successRedirectHref }: ServiceAdminFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editing = Boolean(service);
  const action = service
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction;
  const [state, formAction] = useActionState(action, initialServiceActionState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (service && !serviceHasChanges(service, formData)) {
      toast.warning("No se detectaron cambios en el servicio");
      return;
    }

    const result = await Swal.fire({
      title: editing ? "Guardar cambios" : "Crear servicio",
      text: editing
        ? "Se actualizaran los datos de este servicio."
        : "Se creara un nuevo servicio en el catalogo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editing ? "Guardar cambios" : "Crear servicio",
      cancelButtonText: "Volver",
      confirmButtonColor: "#C8A96E",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleDelete = async () => {
    if (!service) {
      return;
    }

    const result = await Swal.fire({
      title: "Eliminar servicio",
      text: `Esta accion eliminara ${service.name} del catalogo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar servicio",
      cancelButtonText: "Volver",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(async () => {
      const response = await deleteServiceAction(service.id);

      if (response.status === "success") {
        toast.success(response.message);
        router.push(successRedirectHref ?? "/admin/servicios");
        return;
      }

      toast.error(response.message);
    });
  };

  useEffect(() => {
    if (!state.message) {
      return;
    }

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
    <form noValidate onSubmit={handleSubmit} className="space-y-4 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          {editing ? <FiEdit3 className="h-4 w-4 text-[#C8A96E]" /> : <FiPlus className="h-4 w-4 text-[#C8A96E]" />}
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            {editing ? "Editar servicio" : "Nuevo servicio"}
          </h3>
        </div>

        {service?.featured && (
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            Destacado
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Nombre
          <input
            name="name"
            defaultValue={service?.name ?? ""}
            minLength={2}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "name") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "name")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Precio CLP
          <input
            name="price"
            type="number"
            defaultValue={service?.price ?? ""}
            min={1000}
            step={500}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "price") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "price")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Duracion
          <input
            name="durationMin"
            type="number"
            defaultValue={service?.durationMin ?? ""}
            min={5}
            step={5}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          />
          {fieldError(state, "durationMin") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "durationMin")}</p>}
        </label>

        <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Categoria
          <select
            name="categoryId"
            defaultValue={service?.categoryId ?? ""}
            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
          >
            <option value="">Selecciona una categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldError(state, "categoryId") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "categoryId")}</p>}
        </label>

      </div>

      <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Descripcion
        <textarea
          name="description"
          defaultValue={service?.description ?? ""}
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none transition-colors focus:border-[#C8A96E]"
        />
        {fieldError(state, "description") && <p className="text-xs normal-case tracking-normal text-red-400">{fieldError(state, "description")}</p>}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-300">
            <input name="featured" type="checkbox" defaultChecked={service?.featured ?? false} className="h-4 w-4 accent-[#C8A96E]" />
            Destacado
          </label>

          <label className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-300">
            <input name="isActive" type="checkbox" defaultChecked={service?.isActive ?? true} className="h-4 w-4 accent-[#C8A96E]" />
            Activo
          </label>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
          {service && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 text-xs font-bold uppercase tracking-wide text-red-400 transition-colors hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <FiTrash2 className="h-4 w-4" />
              Eliminar servicio
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
