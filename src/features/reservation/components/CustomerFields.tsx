"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { ReservationFormData } from "../schemas/reservation.schema";

type Props = {
  register: UseFormRegister<ReservationFormData>;
  setValue: UseFormSetValue<ReservationFormData>;
  errors: FieldErrors<ReservationFormData>;
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  let nationalNumber = digits;

  // Si empieza con 56, quitar código país
  if (nationalNumber.startsWith("56")) {
    nationalNumber = nationalNumber.slice(2);
  }

  // Si empieza con 9, quitar el 9 inicial
  if (nationalNumber.startsWith("9")) {
    nationalNumber = nationalNumber.slice(1);
  }

  // Máximo 8 dígitos del número móvil
  nationalNumber = nationalNumber.slice(0, 8);

  return `+569${nationalNumber}`;
}

export default function CustomerFields({
  register,
  setValue,
  errors,
}: Props) {
  const [mode, setMode] = useState<"search" | "new">("search");
  const [searching, setSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState("+569");
  const [newPhone, setNewPhone] = useState("+569");
  const [notFound, setNotFound] = useState(false);
  const [found, setFound] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  // Cliente existente encontrado desde el modo "nuevo"
  const [existingInNew, setExistingInNew] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const latestSearchPhone = useRef(searchPhone);
  const latestNewPhone = useRef(newPhone);

  const clearSelectedCustomer = () => {
    setValue("customerId", undefined);
    setValue("customerName", "");
    setValue("customerPhone", "");
    setValue("customerEmail", "");
  };

  const handleSearch = async (phone: string) => {
    if (phone.length < 12) {
      setFound(null);
      setNotFound(false);
      clearSelectedCustomer();
      return;
    }

    setSearching(true);

    try {
      const res = await fetch(
        `/api/customers/search?phone=${encodeURIComponent(phone)}`
      );

      const data = await res.json();

      if (latestSearchPhone.current !== phone) return;

      if (data.customer) {
        setFound(data.customer);
        setNotFound(false);

        setValue("customerId", data.customer.id);
        setValue("customerName", data.customer.name);
        setValue("customerPhone", data.customer.phone);
        
        toast.success(`Cliente encontrado: ${data.customer.name}`);
      } else {
        setFound(null);
        setNotFound(true);
        clearSelectedCustomer();
        
        toast.info("Este numero no se encuentra registrado");
      }
    } finally {
      if (latestSearchPhone.current === phone) {
        setSearching(false);
      }
    }
  };

  // Búsqueda silenciosa para el modo "nuevo": detecta duplicado de teléfono
  const handleNewPhoneSearch = async (phone: string) => {
    if (phone.length < 12) {
      setExistingInNew(null);
      setValue("customerId", undefined);
      return;
    }

    try {
      const res = await fetch(
        `/api/customers/search?phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (latestNewPhone.current !== phone) return;

      if (data.customer) {
        setExistingInNew(data.customer);
        // Vincular al cliente existente para que el schema no exija nombre
        setValue("customerId", data.customer.id);
        toast.warning("Numero ya registrado", {
          duration: 5000,
          style: { borderColor: "rgba(234, 179, 8, 0.4)", color: "#fbbf24" },
        });
      } else {
        setExistingInNew(null);
        setValue("customerId", undefined);
      }
    } catch {
      // silencioso
    }
  };

  const resetCustomer = () => {
    setFound(null);
    setNotFound(false);
    setExistingInNew(null);
    setSearchPhone("+569");
    setNewPhone("+569");

    clearSelectedCustomer();
  };

  return (
    <div className="space-y-4">
      <input type="hidden" {...register("customerMode")} />

      <div className="flex gap-2">
        {(["search", "new"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setValue("customerMode", m);
              resetCustomer();
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${mode === m
              ? "border-[#C8A96E]/40 bg-[#C8A96E]/10 text-[#F5E6C8]"
              : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
          >
            {m === "search"
              ? "Cliente existente"
              : "Cliente nuevo"}
          </button>
        ))}
      </div>

      {mode === "search" ? (
        <div className="space-y-3">
          <input
            type="tel"
            placeholder="+56912345678"
            maxLength={12}
            value={searchPhone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              latestSearchPhone.current = formatted;
              setSearchPhone(formatted);
              handleSearch(formatted);
            }}
            onKeyDown={(e) => {
              const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
              if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
          />

          {searching && (
            <p className="text-zinc-500 text-xs">
              Buscando...
            </p>
          )}

          {found && (
            <div className="bg-zinc-900/60 border border-[#C8A96E]/20 rounded-xl px-4 py-3">
              <p className="text-white text-sm font-medium">
                {found.name}
              </p>
              <p className="text-zinc-400 text-xs">
                {found.phone}
              </p>
            </div>
          )}

          {notFound && (
            <p className="text-zinc-500 text-xs">
              No encontrado.{" "}
              <button
                type="button"
                onClick={() => setMode("new")}
                className="text-[#C8A96E] underline underline-offset-2"
              >
                Crear cliente nuevo
              </button>
            </p>
          )}

          {errors.customerId && (
            <p className="text-red-400 text-xs mt-1">
              {errors.customerId.message}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Juan Pérez"
              {...register("customerName")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
            />

            {errors.customerName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="+56912345678"
              maxLength={12}
              value={newPhone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);

                latestNewPhone.current = formatted;
                setNewPhone(formatted);

                setValue("customerPhone", formatted, {
                  shouldValidate: true,
                });

                handleNewPhoneSearch(formatted);
              }}
              onKeyDown={(e) => {
                const allowed = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ];

                if (
                  !allowed.includes(e.key) &&
                  !/^\d$/.test(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
            />

            {existingInNew && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
                <p className="text-yellow-400 text-xs font-medium">
                  ⚠️ Número ya registrado
                </p>
              </div>
            )}

            {errors.customerPhone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.customerPhone.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              Email (opcional)
            </label>

            <input
              type="email"
              placeholder="juan@email.com"
              {...register("customerEmail")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C8A96E]"
            />

            {errors.customerEmail && (
              <p className="text-red-400 text-xs mt-1">
                {errors.customerEmail.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}