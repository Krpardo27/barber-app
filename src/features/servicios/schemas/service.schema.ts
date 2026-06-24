import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(80, { message: "El nombre no puede superar 80 caracteres" }),

  slug: z
    .string()
    .trim()
    .max(90, { message: "La URL no puede superar 90 caracteres" })
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(240, { message: "La descripcion no puede superar 240 caracteres" })
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number({ message: "Ingresa un precio valido" })
    .int({ message: "El precio debe ser un numero entero" })
    .min(1000, { message: "El precio minimo es $1.000" })
    .max(500000, { message: "El precio maximo es $500.000" }),

  durationMin: z.coerce
    .number({ message: "Ingresa una duracion valida" })
    .int({ message: "La duracion debe ser un numero entero" })
    .min(5, { message: "La duracion minima es 5 minutos" })
    .max(300, { message: "La duracion maxima es 300 minutos" }),

  categoryId: z.string().min(1, { message: "Selecciona una categoria" }),

  featured: z.boolean(),
  isActive: z.boolean(),
});

export function normalizeServiceSlug(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "servicio";
}

export function validateServiceSlug(slug: string) {
  return slugRegex.test(slug);
}

export type ServiceFormData = z.infer<typeof ServiceSchema>;
export type ServiceFieldErrors = Partial<Record<keyof ServiceFormData | "slug", string[]>>;
